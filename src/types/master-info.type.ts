import {UserSpecialityType} from './speciality.type';
import {AdditionalImageType} from './additional-image.type';

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
  is_master: boolean,
  is_favorite: boolean,
  additional_images: AdditionalImageType[]
}
