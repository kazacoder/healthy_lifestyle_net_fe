import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EventType} from '../../../types/event.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {MasterInfoType} from '../../../types/master-info.type';
import {ArticleType} from '../../../types/article.type';

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

  getFavoriteArticleList(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'favorite-article/');
  }

  addArticleToFavorite(id: number): Observable<ArticleType | DefaultResponseType> {
    return this.http.post<ArticleType | DefaultResponseType>(environment.api + 'favorite-article/', {article: id});
  }

  removeArticleFromFavorite(id: number): Observable<null | DefaultResponseType> {
    return this.http.delete<null | DefaultResponseType>(environment.api + 'favorite-article/' + id.toString() + '/');
  }

  toggleFavoriteEventArticle(is_favorite: boolean, article_id: number): Observable<null | ArticleType | DefaultResponseType> {
    if (is_favorite) {
      return this.removeArticleFromFavorite(article_id)
    }
    return this.addArticleToFavorite(article_id);
  }

  getFavoriteMastersList(): Observable<MasterInfoType[] | DefaultResponseType> {
    return this.http.get<MasterInfoType[] | DefaultResponseType>(environment.api + 'favorite-masters/');
  }

  addMasterToFavorite(id: number): Observable<MasterInfoType | DefaultResponseType> {
    return this.http.post<MasterInfoType | DefaultResponseType>(environment.api + 'favorite-masters/', {master: id});
  }

  removeMasterFromFavorite(id: number): Observable<null | DefaultResponseType> {
    return this.http.delete<null | DefaultResponseType>(environment.api + 'favorite-masters/' + id.toString() + '/');
  }

  toggleFavoriteMaster(is_favorite: boolean, event_id: number): Observable<null | MasterInfoType | DefaultResponseType> {
    if (is_favorite) {
      return this.removeMasterFromFavorite(event_id)
    }
    return this.addMasterToFavorite(event_id);
  }
}
