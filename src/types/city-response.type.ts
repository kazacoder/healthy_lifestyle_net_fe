export type CityResponseType = {
  city: string,
  city_fias_id: string,
  city_type: string,
  city_with_type: string,
  region_fias_id: string,
  region_iso_code: string,
  region_with_type: string,
  settlement: null | string
  settlement_fias_id: null | string
  settlement_type: null | string
  settlement_with_type: null | string
  value: string
}

export type CitiesResponseType = {
  cities: CityResponseType[],
}

export type CitesListResponseType = {
  cities: string[];
}
