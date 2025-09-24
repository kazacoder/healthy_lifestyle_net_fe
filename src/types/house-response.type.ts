export type HouseResponseType = {
  value: string,
  house: string,
  house_type: string,
  house_fias_id: string | null,
  geo_lat: string | null,
  geo_lon: string | null,
  qc_geo: number | null
}

export type HousesResponseType = {
  houses: HouseResponseType[],
}
