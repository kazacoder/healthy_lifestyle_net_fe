import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {PublicationParticipantType} from '../../../../../types/publication-participant.type';

@Component({
  selector: 'participants-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './participants-modal.component.html',
  styleUrl: './participants-modal.component.scss'
})
export class ParticipantsModalComponent {
  @Input() isOpened: boolean = false;
  @Input() participants: PublicationParticipantType[] = [];
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }
}
