import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EventType} from '../../../types/event.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  getFavoriteEventsList(): Observable<EventType[] | DefaultResponseType> {
    return this.http.get<EventType[] | DefaultResponseType>(environment.api + 'favorites/');
  }
}
