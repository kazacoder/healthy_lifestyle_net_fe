import {CategoryType} from './category.type';
import {AdditionalImageType} from './additional-image.type';
import {MasterInfoType} from './master-info.type';

export type ArticleType = {
  id: number,
  inner_images: AdditionalImageType[],
  categories: CategoryType[],
  masters: MasterInfoType[],
  is_favorite: boolean,
  day: number,
  month: number,
  type_title: string,
  title: string,
  image: string,
  date: string,
  description: string,
  text: string,
  type: number
}

