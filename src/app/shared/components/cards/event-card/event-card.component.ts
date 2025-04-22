import {Component, Input} from '@angular/core';

@Component({
  selector: 'event-card',
  imports: [],
  standalone: true,
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})


export class EventCardComponent {
  @Input()
  event: {
    img: string,
    day: string,
    month: string,
    type: string,
    typeIcon: string,
    title: string,
  } | null = null;
}
