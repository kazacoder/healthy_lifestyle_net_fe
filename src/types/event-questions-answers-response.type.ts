import {QuestionExtendedType} from './question-extended.type';

export type EventQuestionsAnswersResponseType = {
  questions_without_answers: QuestionExtendedType[],
  questions_with_answers: QuestionExtendedType[],
  number_new_questions: number,
}

