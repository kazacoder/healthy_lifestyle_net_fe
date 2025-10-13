import {Component, Input} from '@angular/core';
import {NotificationType} from '../../../../../types/notification.type';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'notification-card',
  imports: [
    NgIf,
    DatePipe
  ],
  standalone: true,
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  @Input() notification: NotificationType | null = null;
}
