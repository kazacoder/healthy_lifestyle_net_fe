import {CategoryType} from './category.type';
import {AdditionalImageType} from './additional-image.type';

export type EventType = {
  id: number,
  additional_images: AdditionalImageType[],
  categories: CategoryType[],
  author_full_name: string,
  author_photo: string,
  day: number,
  month: number,
  suit_title: string,
  suit_image: string,
  format_title: string,
  is_master: boolean,
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

