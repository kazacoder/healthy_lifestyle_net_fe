import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {MasterInfoType} from '../../../types/master-info.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  getMastersList (paramsObj?: { [key: string]: string[] | number[] }): Observable<MasterInfoType[] | DefaultResponseType> {
    let params = new HttpParams();

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

    return this.http.get<MasterInfoType[] | DefaultResponseType>(environment.api + 'master/', { params });
  }

  getMaster (id: string): Observable<MasterInfoType | DefaultResponseType> {
    return this.http.get<MasterInfoType | DefaultResponseType>(environment.api + 'master/' + id + '/');
  }
}
