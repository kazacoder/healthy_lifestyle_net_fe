import {QuestionExtendedType} from './question-extended.type';

export type EventQuestionResponseType = {
  count: number,
  next: null | string,
  previous: null | string,
  results: QuestionExtendedType[],
}

