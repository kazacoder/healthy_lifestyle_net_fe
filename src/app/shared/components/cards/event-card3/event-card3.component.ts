import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'event-card3',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './event-card3.component.html',
  styleUrl: './event-card3.component.scss'
})
export class EventCard3Component {
  @Input() event: {title: string, img: string, day: string, month: string} | null = null;
}
