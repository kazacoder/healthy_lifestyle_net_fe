import {Component, HostListener, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {EventType} from '../../../../../types/event.type';
import {MonthToStringPipe} from '../../../pipes/month-to-string.pipe';
import {ToIntPipe} from '../../../pipes/to-int.pipe';
import {CommonUtils} from '../../../utils/common-utils';

@Component({
  selector: 'event-card2',
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    NgForOf,
    MonthToStringPipe,
    ToIntPipe
  ],
  standalone: true,
  templateUrl: './event-card2.component.html',
  styleUrl: './event-card2.component.scss',
})
export class EventCard2Component implements OnInit {
  @Input() event: EventType | null = null;
  periodLabel: string = '';
  month: string = ''
  tagsOpen: boolean = false;

  private wasInside = false;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickOut() {
    if (!this.wasInside) {
      this.tagsOpen = false;
    }
    this.wasInside = false;
  }

  ngOnInit() {
    this.periodLabel = CommonUtils.getDurationLabel(this.event!.duration, this.event!.time_period)
    this.month = CommonUtils.getRussianMonthName(this.event!.date);
  }

  clickTagsButton() {
    this.tagsOpen = !this.tagsOpen;
  }
}
