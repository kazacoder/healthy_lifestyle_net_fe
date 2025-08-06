import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EventResponseType} from '../../../types/event-response.type';
import {FiltersDataType} from '../../../types/filters-data.type';
import {ParamsObjectType} from '../../../types/params-object.type';
import {ArticleType} from '../../../types/article.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

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

  getArticle(id: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.api + 'article/' + id + '/');
  }

  getFiltersData(): Observable<FiltersDataType | DefaultResponseType> {
    return this.http.get<FiltersDataType | DefaultResponseType>(`${environment.api}events/filters/`)
  }
}
