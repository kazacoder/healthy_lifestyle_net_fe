import {CategoryType} from './category.type';
import {SuitType} from './suit.type';
import {FormatType} from './format.type';
import {MasterInfoType} from './master-info.type';
import {ArticleTypeType} from './article-type.type';

export type FiltersDataType = {
  categories: CategoryType[],
  suits: SuitType[],
  formats: FormatType[],
  masters: MasterInfoType[],
}


export type FiltersDataTypeArticles = {
  types: ArticleTypeType[],
  categories: CategoryType[],
}

