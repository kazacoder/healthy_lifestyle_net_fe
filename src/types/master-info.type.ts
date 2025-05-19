import {UserSpecialityType} from './speciality.type';

export type MasterInfoType = {
  id: number,
  full_name: string,
  specialities: UserSpecialityType[],
  city: string,
  about_me: string,
  short_description: string,
  photo: string,
  phone: string,
  email: string,
  youtube: string,
  telegram: string,
  vk: string,
  instagram: string,
}
