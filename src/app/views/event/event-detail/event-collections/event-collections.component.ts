import { Component } from '@angular/core';
import {EventCollectionHistoryComponent} from './event-collection-history/event-collection-history.component';
import {EventCollectionMasterComponent} from './event-collection-master/event-collection-master.component';

@Component({
  selector: 'event-collections',
  imports: [
    EventCollectionHistoryComponent,
    EventCollectionMasterComponent
  ],
  standalone: true,
  templateUrl: './event-collections.component.html',
  styleUrl: './event-collections.component.scss'
})
export class EventCollectionsComponent {

}
