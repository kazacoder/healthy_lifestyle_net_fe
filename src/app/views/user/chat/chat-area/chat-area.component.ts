import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'chat-area',
  imports: [],
  standalone: true,
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent {
  @Output() onCloseChat: EventEmitter<boolean> = new EventEmitter(false);


  closeChat() {
    this.onCloseChat.emit(false);
  }

}
