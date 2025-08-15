import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EventType} from '../../../types/event.type';
import {EventQuestionResponseType} from '../../../types/event-question-response.type';
import {QuestionExtendedType} from '../../../types/question-extended.type';
import {AnswerResponseType} from '../../../types/answer-response.type';
import {EventResponseType} from '../../../types/event-response.type';
import {FiltersDataType} from '../../../types/filters-data.type';
import {ParamsObjectType} from '../../../types/params-object.type';
import {BookingResponseType} from '../../../types/booking-response.type';
import {EventQuestionsAnswersResponseType} from '../../../types/event-questions-answers-response.type';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {
  }


  getEventsList(limit?: number, offset?: number, paramsObj?: ParamsObjectType | null): Observable<EventResponseType | DefaultResponseType> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }

    if (paramsObj) {
      Object.keys(paramsObj).forEach(key => {
        const value = paramsObj[key];
        if (Array.isArray(value)) {
          value.forEach(v => {
            params = params.append(key, v);
          });
        } else if (value !== undefined && value !== null) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<EventResponseType | DefaultResponseType>(environment.api + 'event/', {params});
  }

  getEvent(id: string): Observable<EventType | DefaultResponseType> {
    return this.http.get<EventType | DefaultResponseType>(environment.api + 'event/' + id + '/');
  }

  getBookedEventPlacesByUser(id: string): Observable<{places: number} | DefaultResponseType> {
    return this.http.get<{places: number} | DefaultResponseType>(environment.api + 'events/' + id + '/user-booking-places/');
  }

  getBookedEventsByUser(period: string): Observable<BookingResponseType[] | DefaultResponseType> {
    return this.http.get<BookingResponseType[] | DefaultResponseType>(environment.api + 'bookings/' + period + '/');
  }

  bookEvent(eventId: string): Observable<BookingResponseType | DefaultResponseType> {
    return this.http.post<BookingResponseType | DefaultResponseType>(environment.api + 'bookings/', {event: eventId, places: 1});
  }

  getQuestion(questionId: string): Observable<QuestionExtendedType | DefaultResponseType> {
    return this.http.get<QuestionExtendedType | DefaultResponseType>(`${environment.api}event-questions/${questionId}/`)
  }

  createQuestion(eventId: string, text: string): Observable<QuestionExtendedType | DefaultResponseType> {
    return this.http.post<QuestionExtendedType | DefaultResponseType>(environment.api + 'event-questions/', {event: eventId, text: text})
  }

  createAnswer(questionId: number, text: string): Observable<AnswerResponseType | DefaultResponseType> {
    return this.http.post<AnswerResponseType | DefaultResponseType>(environment.api + 'event-answers/',
      {question: questionId, text: text})
  }

  updateAnswer(answerId: number, text: string): Observable<AnswerResponseType | DefaultResponseType> {
    return this.http.patch<AnswerResponseType | DefaultResponseType>(`${environment.api}event-answers/${answerId}/`,
      {text: text})
  }

  getQuestionsWithAnswers(eventId: string, limit?: number, offset?: number): Observable<EventQuestionResponseType | DefaultResponseType> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }

    return this.http.get<EventQuestionResponseType | DefaultResponseType>(
      `${environment.api}events/${eventId}/questions/`,
      { params });
  }

  getQuestionsWithAnswersAnwWithout(eventId: string): Observable<EventQuestionsAnswersResponseType | DefaultResponseType> {
    return this.http.get<EventQuestionsAnswersResponseType | DefaultResponseType>(
      `${environment.api}events/${eventId}/questions_answers/`, );
  }

  getFiltersData(): Observable<FiltersDataType | DefaultResponseType> {
    return this.http.get<FiltersDataType | DefaultResponseType>(`${environment.api}events/filters/`)
  }
}
