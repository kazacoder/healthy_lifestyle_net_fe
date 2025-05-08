import {SpecialityType} from './speciality.type';

export type UserFullInfoType = {
  id: number,
  url: string,
  specialities: SpecialityType[],
  lastLogin: string | null,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  is_active: boolean,
  dateJoined: string,
  photo: string,
  status: number,
  city: string,
  youtube: string,
  telegram: string,
  vk: string,
  instagram: string,
  phone: string,
  about_me: string,
  receive_notifications_site: boolean,
  receive_notifications_email: boolean,
  receive_notifications_events: boolean,
  receive_notifications_news: boolean,
  receive_notifications_books: boolean,
  receive_notifications_questions: boolean
}
