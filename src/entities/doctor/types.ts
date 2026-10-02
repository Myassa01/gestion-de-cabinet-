export interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  bio: string | null
  roomNo: string | null
}

export interface AdminDoctorListItem extends Doctor {
  isActive: boolean
  absentToday: boolean
}

export interface Slot {
  start: string // ISO datetime
  end: string
}
