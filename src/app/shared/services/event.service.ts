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

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {
  }


  getEventsList(limit?: number, offset?: number): Observable<EventResponseType | DefaultResponseType> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }

    return this.http.get<EventResponseType | DefaultResponseType>(environment.api + 'event/', {params});
  }

  getEvent(id: string): Observable<EventType | DefaultResponseType> {
    return this.http.get<EventType | DefaultResponseType>(environment.api + 'event/' + id + '/');
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

  getFiltersData(): Observable<FiltersDataType | DefaultResponseType> {
    return this.http.get<FiltersDataType | DefaultResponseType>(`${environment.api}events/filters/`)
  }
}
