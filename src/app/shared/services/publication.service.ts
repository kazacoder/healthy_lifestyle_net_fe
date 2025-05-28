import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CategoryType} from '../../../types/category.type';
import {PublicationType} from '../../../types/publication.type';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private http: HttpClient) { }

  getCategoriesList (): Observable<CategoryType[] | DefaultResponseType> {
    return this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'category/');
  }

  getPublicationsList (): Observable<PublicationType[] | DefaultResponseType> {
    return this.http.get<PublicationType[] | DefaultResponseType>(environment.api + 'publication/');
  }

  createPublication (formData: FormData): Observable<PublicationType | DefaultResponseType> {
    return this.http.post<PublicationType | DefaultResponseType>(environment.api + 'publication/', formData);
  }

  getPublication (id: string): Observable<PublicationType | DefaultResponseType> {
    return this.http.get<PublicationType | DefaultResponseType>(environment.api + 'publication/' + id + '/');
  }

  removePublication (id: number): Observable<null | DefaultResponseType> {
    return this.http.delete<null | DefaultResponseType>(environment.api + 'publication/' + id.toString() + '/');
  }

  updatePublication (id: number, formData: FormData): Observable<PublicationType | DefaultResponseType> {
    return this.http.patch<PublicationType | DefaultResponseType>(environment.api + 'publication/' + id.toString() + '/', formData);
  }
}
