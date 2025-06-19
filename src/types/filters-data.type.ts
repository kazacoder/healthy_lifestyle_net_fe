import {CategoryType} from './category.type';
import {SuitType} from './suit.type';
import {FormatType} from './format.type';
import {MasterInfoType} from './master-info.type';

export type FiltersDataType = {
  categories: CategoryType[],
  suits: SuitType[],
  formats: FormatType[],
  masters: MasterInfoType[],
}

