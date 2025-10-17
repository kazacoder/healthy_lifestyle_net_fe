import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {ChatAreaComponent} from '../../../../views/user/chat/chat-area/chat-area.component';
import {UserShortType} from '../../../../../types/user-info.type';

@Component({
  selector: 'chat-modal',
  imports: [
    CloseBtnMobComponent,
    ChatAreaComponent,
  ],
  standalone: true,
  templateUrl: './chat-modal.component.html',
  styleUrl: './chat-modal.component.scss'
})
export class ChatModalComponent {
  @Input() companion: UserShortType | null = null;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  closeModal() {
    this.onCloseModal.emit(false)
  }
}
