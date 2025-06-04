import { Component } from '@angular/core';
import {EventItemComponent} from './event-item/event-item.component';
import {EventDescComponent} from './event-desc/event-desc.component';

@Component({
  selector: 'app-event-detail',
  imports: [
    EventItemComponent,
    EventDescComponent
  ],
  standalone: true,
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {

}
