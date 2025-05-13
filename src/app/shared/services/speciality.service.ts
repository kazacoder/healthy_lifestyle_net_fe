import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {UserFullInfoType} from '../../../types/user-full-info.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {SpecialityType} from '../../../types/speciality.type';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpecialityService {

  constructor(private http: HttpClient) { }

  getSpecialityList(): Observable<SpecialityType[] | DefaultResponseType> {
    return this.http.get<SpecialityType[] | DefaultResponseType>(environment.api + 'specialities/');
  }
}
