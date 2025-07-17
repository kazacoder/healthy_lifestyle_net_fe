import {Component, Input, OnInit} from '@angular/core';
import {EventType} from '../../../../../types/event.type';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CommonUtils} from '../../../utils/common-utils';

@Component({
  selector: 'note-card2',
  imports: [
    NgClass,
    RouterLink
  ],
  standalone: true,
  templateUrl: './note-card2.component.html',
  styleUrl: './note-card2.component.scss'
})
export class NoteCard2Component implements OnInit {
  @Input() event: EventType | null = null;
  month: string = ''


  toggleFavorite() {
    if (this.event) {
      this.event.is_favorite = !this.event.is_favorite;
    }
  }

  ngOnInit() {
    this.month = CommonUtils.getRussianMonthName(this.event!.date);
  }
}
