import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CategoryType} from '../../../types/category.type';
import {PublicationType} from '../../../types/publication.type';
import {SuitType} from '../../../types/suit.type';
import {FormatType} from '../../../types/format.type';
import {TimePeriodType} from '../../../types/time-period.type';
import {PublicationParticipantType} from '../../../types/publication-participant.type';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  categoryListSubject = new BehaviorSubject<CategoryType[]>([]);
  categoryList$ = this.categoryListSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCategoriesList (): Observable<CategoryType[] | DefaultResponseType> {
    // Если данные уже есть, возвращаем их как Observable
    if (this.categoryListSubject.value.length > 0) {
      return this.categoryList$;
    }

    return this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'category/').pipe(
      map(data => {
        // Если пришёл массив категорий — сохраняем и возвращаем
        if (Array.isArray(data)) {
          this.categoryListSubject.next(data);
          // return data;
        }
        // Если пришёл объект с detail (ошибка) — возвращаем
        return data;
      })
    );

    // return this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'category/');
  }

  getSuitsList (): Observable<SuitType[] | DefaultResponseType> {
    return this.http.get<SuitType[] | DefaultResponseType>(environment.api + 'suit/');
  }
  getFormatList (): Observable<FormatType[] | DefaultResponseType> {
    return this.http.get<SuitType[] | DefaultResponseType>(environment.api + 'format/');
  }
  getTimePeriodList (): Observable<TimePeriodType[] | DefaultResponseType> {
    return this.http.get<SuitType[] | DefaultResponseType>(environment.api + 'timeperiod/');
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

  getPublicationParticipantsList (eventId: number): Observable<PublicationParticipantType[] | DefaultResponseType> {
    return this.http.get<PublicationParticipantType[] | DefaultResponseType>(environment.api + 'event-participants/' + eventId.toString() + '/');
  }
}
