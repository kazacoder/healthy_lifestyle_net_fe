export type SpecialityType = {
  speciality: string,
  experience_since: string
  id: number,
  speciality_id: number
}


export type SpecialityUpdateType = {
  user: number,
  specialities : {
    experience_since: string
    speciality_id: number
    id?: number,
  }[]
}
