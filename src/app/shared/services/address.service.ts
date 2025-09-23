import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  getAddressSuggest(query: string, count: number = 10) {
    return this.http.post(environment.api + 'address/', {query, count});
  }

  getCitySuggest(query: string, count: number = 20) {
    return this.http.post(environment.api + 'address/city/', {query, count});
  }
}
