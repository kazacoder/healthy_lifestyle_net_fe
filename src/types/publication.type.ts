import {CategoryType} from './category.type';
import {AdditionalImageType} from './additional-image.type';

export type PublicationType = {
  id: number,
  additional_images: AdditionalImageType[],
  categories: CategoryType[],
  total_booked: number,
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
  format: number,
  number_new_questions: number
}


export const publicationFormFieldsMatch = {
  title: {group: null, field: 'title'},
  phone: {group: null, field: 'phone'},
  ticketAmount: {group: null, field: 'ticket_amount'},
  pricing: {group: null, field: 'is_free'},
  price: {group: null, field: 'price'},
  prepayment: {group: null, field: 'prepayment'},
  city: {group: 'address', field: 'city'},
  street: {group: 'address', field: 'street'},
  house: {group: 'address', field: 'house'},
  floor: {group: 'address', field: 'floor'},
  office: {group: 'address', field: 'office'},
  amount: {group: 'duration', field: 'duration'},
  timePeriod: {group: 'duration', field: 'time_period'},
  suit: {group: null, field: 'suit'},
  format: {group: null, field: 'format'},
  date: {group: null, field: 'date'},
  whatsapp: {group: null, field: 'whatsapp'},
  telegram: {group: null, field: 'telegram'},
  description: {group: null, field: 'description'},
  categories: {group: null, field: 'categories'},
}

export type PubFormKey = keyof typeof publicationFormFieldsMatch;
