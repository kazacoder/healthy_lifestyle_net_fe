export type FilterObjectType = {
  title: string,
  name: string,
  options: { id: string | number, title: string}[],
  search: boolean,
  defaultOption?: string,
  multi?: boolean,
  composite?: boolean,
}

