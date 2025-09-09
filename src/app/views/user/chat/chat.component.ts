import { Component } from '@angular/core';
import {ChatItemCardComponent} from '../../../shared/components/cards/chat-item-card/chat-item-card.component';
import {ChatAreaComponent} from './chat-area/chat-area.component';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [
    ChatItemCardComponent,
    ChatAreaComponent,
    NgClass,
    NgForOf
  ],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  isOpenedChat: boolean = false;
  selectedChatIndex: number | null = null;

  openChat(index: number) {
    this.isOpenedChat = true;
    this.selectedChatIndex = index;
  }

  closeChat() {
    this.isOpenedChat = false;
    this.selectedChatIndex = null;
  }
}
