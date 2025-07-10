import {EventType} from './event.type';

export type BookingResponseType = {
  id: number,
  user: number,
  event: number,
  event_detail: EventType
  places: number,
  created_at: string
}
