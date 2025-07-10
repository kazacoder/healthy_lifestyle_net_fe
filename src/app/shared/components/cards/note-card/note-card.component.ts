import {Component, Input, OnChanges} from '@angular/core';
import {BookingResponseType} from '../../../../../types/booking-response.type';
import {CommonUtils} from '../../../utils/common-utils';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'note-card',
  imports: [
    RouterLink
  ],
  standalone: true,
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent implements OnChanges {
  @Input() booking: BookingResponseType | null = null;
  month: string = '';

  ngOnChanges() {
    this.month = CommonUtils.getRussianMonthName(this.booking!.event_detail.date);
  }
}
