import {EventType} from './event.type';

export type EventResponseType = {
  count: number,
  next: null | string,
  previous: null | string,
  results: EventType[],
}

