import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NotificationType} from '../../../../../types/notification.type';
import {DatePipe, NgIf} from '@angular/common';
import {FeedbackService} from '../../../services/feedback.service';
import {take} from 'rxjs';
import {DefaultResponseType} from '../../../../../types/default-response.type';

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
  @Output() onMarkAsRead: EventEmitter<boolean> = new EventEmitter();

  constructor(private feedbackService: FeedbackService) {

  }

  markAsRead() {
    if (this.notification)
    this.feedbackService.markNotificationAsRead(this.notification.id).pipe(take(1)).subscribe({
      next: result => {
        if ((result as DefaultResponseType).detail !== undefined) {
          const error = (result as DefaultResponseType).detail;
          throw new Error(error);
        }
        this.notification!.is_read = true;
        this.onMarkAsRead.emit(true);
      },
      error: error => {console.error(error);},
    })
  }
}
