import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FiltersDataTypeArticles} from '../../../types/filters-data.type';
import {ParamsObjectType} from '../../../types/params-object.type';
import {ArticleType} from '../../../types/article.type';
import {ArticleResponseType} from '../../../types/article-response.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getArticlesList(limit?: number, offset?: number, paramsObj?: ParamsObjectType | null): Observable<ArticleResponseType | DefaultResponseType> {
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

    return this.http.get<ArticleResponseType | DefaultResponseType>(environment.api + 'article/', {params});
  }

  getArticle(id: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.api + 'article/' + id + '/');
  }

  getFiltersData(): Observable<FiltersDataTypeArticles | DefaultResponseType> {
    return this.http.get<FiltersDataTypeArticles | DefaultResponseType>(`${environment.api}articles/filters/`)
  }

  getRecentArticleList(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(`${environment.api}recent-articles/`)
  }
}
