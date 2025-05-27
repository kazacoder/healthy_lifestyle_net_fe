import {CategoryType} from './category.type';

export type PublicationType = {
  id: number,
  additional_images: AdditionalImage[],
  categories: CategoryType[],
  title: string,
  image: string,
  phone: string,
  ticket_amount: number,
  is_free: boolean,
  price: string,
  prepayment: string,
  city: string | null,
  street: string | null,
  house: string | null,
  floor: string | null,
  office: string | null,
  duration: number,
  date: string,
  whatsapp: string | null,
  telegram: string | null,
  description: string,
  author: number,
  time_period: number,
  suit: number,
  format: number
}

export type AdditionalImage = {
  id: number,
  file: string,
}
