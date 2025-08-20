import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'chat-item-card',
  imports: [
    NgClass
  ],
  standalone: true,
  templateUrl: './chat-item-card.component.html',
  styleUrl: './chat-item-card.component.scss'
})
export class ChatItemCardComponent {
  @Input() active: boolean = false;

}
