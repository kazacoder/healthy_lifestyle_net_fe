import {Component, Input} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';

@Component({
  selector: 'answer-card',
  imports: [
    DatePipe,
    NgIf
  ],
  standalone: true,
  templateUrl: './answer-card.component.html',
  styleUrl: './answer-card.component.scss'
})
export class AnswerCardComponent {
  @Input() questionsWithAnswer: QuestionExtendedType | null = null;
  edit: boolean = false;


  proceedEdit() {
    this.edit = !this.edit;
  }

}
