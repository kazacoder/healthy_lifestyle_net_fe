export type StreetResponseType = {
  value: string,
  street: string,
  street_with_type: string,
  street_type: string,
  street_fias_id: string,
}

export type StreetsResponseType = {
  streets: StreetResponseType[],
}
