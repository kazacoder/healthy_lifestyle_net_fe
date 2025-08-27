import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {EventType} from '../../../../../types/event.type';
import {RouterLink} from '@angular/router';
import {CommonUtils} from '../../../utils/common-utils';

@Component({
  selector: 'event-card3',
  imports: [
    NgIf,
    RouterLink
  ],
  standalone: true,
  templateUrl: './event-card3.component.html',
  styleUrl: './event-card3.component.scss'
})
export class EventCard3Component {
  @Input() event: EventType | null = null;
  getRussianMonthName = CommonUtils.getRussianMonthName
}
