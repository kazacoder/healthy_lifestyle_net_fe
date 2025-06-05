import { Component } from '@angular/core';
import {EventItemComponent} from './event-item/event-item.component';
import {EventDescComponent} from './event-desc/event-desc.component';
import {EventQuestionsComponent} from './event-questions/event-questions.component';
import {EventAddressComponent} from './event-address/event-address.component';
import {EventCollectionsComponent} from './event-collections/event-collections.component';

@Component({
  selector: 'app-event-detail',
  imports: [
    EventItemComponent,
    EventDescComponent,
    EventQuestionsComponent,
    EventAddressComponent,
    EventCollectionsComponent
  ],
  standalone: true,
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {

}
