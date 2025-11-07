export type UserSpecialityType = {
  speciality: string,
  experience_since: string
  id: number,
  speciality_id: number
}


export type UserSpecialityUpdateType = {
  user: string,
  specialities : {
    experience_since: string
    speciality_id: number
    id?: number,
  }[]
}

export type SpecialityType = {
  title: string,
  id: number,
  selected?: boolean,
}
