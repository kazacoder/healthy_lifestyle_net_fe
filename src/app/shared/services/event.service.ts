import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {EventType} from '../../../types/event.type';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }


  getEventsList (): Observable<EventType[] | DefaultResponseType> {
    return this.http.get<EventType[] | DefaultResponseType>(environment.api + 'event/');
  }


  getEvent (id: string): Observable<EventType | DefaultResponseType> {
    return this.http.get<EventType | DefaultResponseType>(environment.api + 'event/' + id + '/');
  }


}
