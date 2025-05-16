import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'confirm-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @Input()
  isOpen: boolean = true;
  @Input()
  text: string = '';

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() onConfirmClick: EventEmitter<boolean> = new EventEmitter(false);


  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
  }

  confirmAction() {
    this.onConfirmClick.emit(true)
  }
}
