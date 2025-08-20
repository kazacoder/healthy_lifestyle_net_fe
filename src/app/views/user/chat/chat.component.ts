import { Component } from '@angular/core';
import {ChatItemCardComponent} from '../../../shared/components/cards/chat-item-card/chat-item-card.component';
import {ChatAreaComponent} from './chat-area/chat-area.component';

@Component({
  selector: 'app-chat',
  imports: [
    ChatItemCardComponent,
    ChatAreaComponent
  ],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

}
