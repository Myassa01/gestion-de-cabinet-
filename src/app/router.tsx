import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DoctorsPage } from '../pages/DoctorsPage'
import { ContactPage } from '../pages/ContactPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ForbiddenPage } from '../pages/ForbiddenPage'
import { ProtectedRoute } from '../features/auth/ui/ProtectedRoute'
import { AppHomePage } from '../pages/AppHomePage'
import { PatientHomePage } from '../pages/patient/PatientHomePage'
import { FindDoctorPage } from '../pages/patient/FindDoctorPage'
import { MyAppointmentsPage } from '../pages/patient/MyAppointmentsPage'
import { BookAppointmentPage } from '../pages/patient/BookAppointmentPage'
import { AppointmentDetailPage } from '../pages/patient/AppointmentDetailPage'
import { RescheduleAppointmentPage } from '../pages/patient/RescheduleAppointmentPage'
import { ProfilePage } from '../pages/patient/ProfilePage'
import { AgendaPage } from '../pages/doctor/AgendaPage'
import { DoctorDashboardPage } from '../pages/doctor/DoctorDashboardPage'
import { DoctorAppointmentsPage } from '../pages/doctor/DoctorAppointmentsPage'
import { DoctorAppointmentDetailPage } from '../pages/doctor/DoctorAppointmentDetailPage'
import { AvailabilityPage } from '../pages/doctor/AvailabilityPage'
import { AbsencesPage } from '../pages/doctor/AbsencesPage'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { NewDoctorPage } from '../pages/admin/NewDoctorPage'
import { NewPatientPage } from '../pages/admin/NewPatientPage'
import { AdminDoctorsPage } from '../pages/admin/AdminDoctorsPage'
import { AdminPatientsPage } from '../pages/admin/AdminPatientsPage'
import { AdminAppointmentsPage } from '../pages/admin/AdminAppointmentsPage'
import { NotificationsPage } from '../pages/NotificationsPage'

const ALL_ROLES = ['PATIENT', 'DOCTOR', 'ADMIN'] as const

// NOTE ON PATH NAMING: React Router resolves /app/appointments (or any
// literal path segment) to whichever sibling branch declares it FIRST in
// this tree, evaluated at route-matching time — BEFORE any guard component
// renders. Verified directly against createMemoryRouter: registering
// "appointments" under both the PATIENT and DOCTOR guard groups always
// resolved to the PATIENT branch's element, regardless of the real user's
// role (the DOCTOR branch's own route was simply never reached). This is
// the same class of bug as the earlier bare-"/app" index-route issue, just
// triggered by a named segment instead of an index route. Fix: every
// role's route tree uses a role-prefixed path (see below); AppSidebar
// builds its links from the current role rather than a shared path.
export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/doctors', element: <DoctorsPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  {
    path: '/book/:doctorId?',
    element: <ProtectedRoute allowedRoles={['PATIENT']} />,
    children: [{ index: true, element: <BookAppointmentPage /> }],
  },
  {
    path: '/app',
    // Role-agnostic guard: only checks "is logged in". AppHomePage (the
    // index route) then redirects to the role-specific dashboard path
    // below, each of which carries its own role-specific ProtectedRoute.
    element: <ProtectedRoute allowedRoles={[...ALL_ROLES]} />,
    children: [
      { index: true, element: <AppHomePage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      {
        element: <ProtectedRoute allowedRoles={['PATIENT']} />,
        children: [
          { path: 'home', element: <PatientHomePage /> },
          { path: 'doctors', element: <FindDoctorPage /> },
          { path: 'appointments', element: <MyAppointmentsPage /> },
          { path: 'appointments/:id', element: <AppointmentDetailPage /> },
          { path: 'appointments/:id/reschedule', element: <RescheduleAppointmentPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['DOCTOR']} />,
        children: [
          { path: 'doctor-home', element: <DoctorDashboardPage /> },
          { path: 'agenda', element: <AgendaPage /> },
          { path: 'doctor-appointments', element: <DoctorAppointmentsPage /> },
          { path: 'doctor-appointments/:id', element: <DoctorAppointmentDetailPage /> },
          { path: 'availability', element: <AvailabilityPage /> },
          { path: 'absences', element: <AbsencesPage /> },
          { path: 'doctor-profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'admin-doctors', element: <AdminDoctorsPage /> },
          { path: 'doctors/new', element: <NewDoctorPage /> },
          { path: 'admin-patients', element: <AdminPatientsPage /> },
          { path: 'admin-patients/new', element: <NewPatientPage /> },
          { path: 'admin-appointments', element: <AdminAppointmentsPage /> },
          { path: 'admin-profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
