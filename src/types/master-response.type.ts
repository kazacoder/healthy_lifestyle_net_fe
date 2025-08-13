import {MasterInfoType} from './master-info.type';

export type MasterResponseType = {
  count: number,
  next: null | string,
  previous: null | string,
  results: MasterInfoType[],
}

