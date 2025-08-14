import {Component, Input} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';

@Component({
  selector: 'question-card',
  imports: [
    NgClass,
    DatePipe
  ],
  standalone: true,
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent {
  @Input() question: QuestionExtendedType | null = null;
}
