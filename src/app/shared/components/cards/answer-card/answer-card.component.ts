import {Component, Input} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';
import {ConfirmModalComponent} from '../../modals/confirm-modal/confirm-modal.component';
import {WindowsUtils} from '../../../utils/windows-utils';

@Component({
  selector: 'answer-card',
  imports: [
    DatePipe,
    NgIf,
    ConfirmModalComponent
  ],
  standalone: true,
  templateUrl: './answer-card.component.html',
  styleUrl: './answer-card.component.scss'
})
export class AnswerCardComponent {
  @Input() questionsWithAnswer: QuestionExtendedType | null = null;
  edit: boolean = false;
  isOpenConfirmModal: boolean = false;


  saveAnswer() {
    this.edit = false;
    console.log('сохранение изменений');
  }


  toggleEdit() {
    this.edit = !this.edit;
  }

  removeAnswer() {
    console.log('удаление ответа');
    this.toggleDeleteModal(false);
  }

  toggleDeleteModal(val: boolean) {
    this.isOpenConfirmModal = val;
    WindowsUtils.fixBody(val);
  }
}
