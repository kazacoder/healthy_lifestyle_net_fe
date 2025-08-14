import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {QuestionCardComponent} from '../../cards/question-card/question-card.component';
import {NgClass, NgForOf} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';

@Component({
  selector: 'questions-answers-modal',
  imports: [
    CloseBtnMobComponent,
    QuestionCardComponent,
    NgClass,
    NgForOf
  ],
  standalone: true,
  templateUrl: './questions-answers-modal.component.html',
  styleUrl: './questions-answers-modal.component.scss'
})
export class QuestionsAnswersModalComponent {
  @Input() isOpened: boolean = false;
  @Input() questions: QuestionExtendedType[] = [];
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter();

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }
}
