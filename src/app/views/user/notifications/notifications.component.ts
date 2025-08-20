import { Component } from '@angular/core';
import {
  NotificationCardComponent
} from '../../../shared/components/cards/notification-card/notification-card.component';

@Component({
  selector: 'app-notifications',
  imports: [
    NotificationCardComponent
  ],
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

}
