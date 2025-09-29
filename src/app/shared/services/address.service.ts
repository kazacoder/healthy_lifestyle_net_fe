import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {StreetsResponseType} from '../../../types/street-response.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {HousesResponseType} from '../../../types/house-response.type';
import {CitiesResponseType} from '../../../types/city-response.type';
import {GeolocationResponseType} from '../../../types/geolocation-response.type';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  getAddressSuggest(query: string, count: number = 10) {
    return this.http.post(environment.api + 'address/', {query, count});
  }

  getCitySuggest(query: string, count: number = 20) : Observable<CitiesResponseType | DefaultResponseType> {
    return this.http.post<CitiesResponseType | DefaultResponseType>(environment.api + 'address/city/', {query, count});
  }

  getStreetSuggest(query: string, locations: {settlement_fias_id: string} | {city_fias_id: string}, count: number = 20): Observable<StreetsResponseType | DefaultResponseType> {
    return this.http.post<StreetsResponseType | DefaultResponseType>(environment.api + 'address/street/', {query, locations, count});
  }

  getHouseSuggest(query: string, street_fias_id: string, count: number = 20): Observable<DefaultResponseType | HousesResponseType> {
    return this.http.post<HousesResponseType | DefaultResponseType>(environment.api + 'address/house/', {query, street_fias_id, count});
  }

  getGeoLocation(lat: number, lon: number, count: number = 1): Observable<DefaultResponseType | GeolocationResponseType> {
    return this.http.post<GeolocationResponseType | DefaultResponseType>(environment.api + 'address/geolocation/', {lat, lon, count});
  }
}
