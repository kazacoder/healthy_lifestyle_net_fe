import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {DialogType} from '../../../../../types/dialog.type';

@Component({
  selector: 'chat-item-card',
  imports: [
    NgClass,
    NgIf,
    DatePipe
  ],
  standalone: true,
  templateUrl: './chat-item-card.component.html',
  styleUrl: './chat-item-card.component.scss'
})
export class ChatItemCardComponent {
  @Input() active: boolean = false;
  @Input() dialog: DialogType | null = null;

}
