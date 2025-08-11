import {ArticleType} from './article.type';

export type ArticleResponseType = {
  count: number,
  next: null | string,
  previous: null | string,
  results: ArticleType[],
}

