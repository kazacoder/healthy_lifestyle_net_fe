import {SpecialityType} from './speciality.type';

export type UserFullInfoType = {
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
  receiveNotificationsSite: boolean,
  receiveNotificationsEmail: boolean,
  receiveNotificationsEvents: boolean,
  receiveNotificationsNews: boolean,
  receiveNotificationsBooks: boolean,
  receiveNotificationsQuestions: boolean
}
