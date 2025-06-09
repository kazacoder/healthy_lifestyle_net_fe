import {AnswerExtendedType} from './answer-extended.type';

export type QuestionExtendedType = {
  id: number,
  event: number,
  text: string,
  created_at: string,
  updated_at: string,
  author_full_name: string,
  author_photo: string,
  read_by_author: boolean,
  answer: AnswerExtendedType,
}

