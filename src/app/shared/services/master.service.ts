import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {MasterInfoType} from '../../../types/master-info.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  getMastersList (): Observable<MasterInfoType[] | DefaultResponseType> {
    return this.http.get<MasterInfoType[] | DefaultResponseType>(environment.api + 'master/');
  }

  getMaster (id: string): Observable<MasterInfoType | DefaultResponseType> {
    return this.http.get<MasterInfoType | DefaultResponseType>(environment.api + 'master/' + id + '/');
  }
}
