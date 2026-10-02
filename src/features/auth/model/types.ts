export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN'

export interface PatientProfile {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  dateOfBirth: string | null
  address: string | null
}

export interface DoctorProfile {
  id: string
  firstName: string
  lastName: string
  specialty: string
  bio: string | null
  roomNo: string | null
}

export interface AdminProfile {
  id: string
  firstName: string
  lastName: string
}

export interface CurrentUser {
  id: string
  email: string
  role: Role
  patient: PatientProfile | null
  doctor: DoctorProfile | null
  admin: AdminProfile | null
}
