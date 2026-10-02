import type { AppointmentStatus } from '../../shared/lib/appointment-status'

export interface AppointmentDoctorSummary {
  id: string
  firstName: string
  lastName: string
  specialty: string
}

export interface AppointmentPatientSummary {
  id: string
  firstName: string
  lastName: string
  phone: string | null
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  slotStart: string
  slotEnd: string
  status: AppointmentStatus
  reason: string | null
  cancelledBy: 'PATIENT' | 'DOCTOR' | 'ADMIN' | null
  cancellationReason: string | null
  createdAt: string
  updatedAt: string
  doctor: AppointmentDoctorSummary
  patient: AppointmentPatientSummary
}
