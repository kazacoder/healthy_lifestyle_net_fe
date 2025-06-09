import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EventType} from '../../../types/event.type';
import {EventQuestionResponseType} from '../../../types/event-question-response.type';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {
  }


  getEventsList(): Observable<EventType[] | DefaultResponseType> {
    return this.http.get<EventType[] | DefaultResponseType>(environment.api + 'event/');
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


  getEvent(id: string): Observable<EventType | DefaultResponseType> {
    return this.http.get<EventType | DefaultResponseType>(environment.api + 'event/' + id + '/');
  }


}
