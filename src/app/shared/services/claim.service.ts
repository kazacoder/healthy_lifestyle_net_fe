import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {ClaimResponseType} from '../../../types/claim-response.type';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private http: HttpClient) { }

  createClaim(id: string, type: 'master' | 'event', text: string): Observable<ClaimResponseType | DefaultResponseType> {
    const requests = {
      master: {master: parseInt(id), text: text},
      event: {event: parseInt(id), text: text}
    }
    return this.http.post<ClaimResponseType | DefaultResponseType>(environment.api + type + '-claims/', requests[type])
  }
}
