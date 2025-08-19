import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'info-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss'
})
export class InfoModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Спасибо за уделенное время';
  @Input() text: string = '';
  @Input() btnTitle: string = 'Закрыть';

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
  }
}
