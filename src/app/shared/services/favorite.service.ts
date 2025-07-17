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

  addEventToFavorite(id: number): Observable<EventType | DefaultResponseType> {
    return this.http.post<EventType | DefaultResponseType>(environment.api + 'favorites/', {event: id});
  }

  removeEventFromFavorite(id: number): Observable<null | DefaultResponseType> {
    return this.http.delete<null | DefaultResponseType>(environment.api + 'favorites/' + id.toString() + '/');
  }

  toggleFavoriteEvent(is_favorite: boolean, event_id: number): Observable<null | EventType | DefaultResponseType> {
    if (is_favorite) {
      return this.removeEventFromFavorite(event_id)
    }
    return this.addEventToFavorite(event_id);
  }
}
