export interface AdminPatientListItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  appointmentCount: number
}
