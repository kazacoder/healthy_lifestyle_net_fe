import {Component, Input, OnChanges } from '@angular/core';
import {EventType} from '../../../../../types/event.type';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MonthToStringPipe} from '../../../../shared/pipes/month-to-string.pipe';
import {CommonUtils} from '../../../../shared/utils/common-utils';
import {ToIntPipe} from '../../../../shared/pipes/to-int.pipe';

@Component({
  selector: 'event-item',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    MonthToStringPipe,
    NgStyle,
    ToIntPipe
  ],
  standalone: true,
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss'

})
export class EventItemComponent implements OnChanges {
  periodLabel: string = '';
  @Input() event: EventType | null = null;
  month: string= ''
  @Input() address: string | null = '';

  ngOnChanges() {
    if (this.event?.duration && this.event?.time_period) {
      this.periodLabel = CommonUtils.getDurationLabel(this.event!.duration, this.event!.time_period)
    }
    this.month = CommonUtils.getRussianMonthName(this.event!.date);
  }
}
