import {AnswerExtendedType} from './answer-extended.type';

export type EventQuestionResponseType = {
  count: number,
  next: null | string,
  previous: null | string,
  results: AnswerExtendedType[],
}

