import { Component } from '@angular/core';
import {EventQuestionItemComponent} from './event-question-item/event-question-item.component';

@Component({
  selector: 'event-questions',
  imports: [
    EventQuestionItemComponent
  ],
  standalone: true,
  templateUrl: './event-questions.component.html',
  styleUrl: './event-questions.component.scss'
})
export class EventQuestionsComponent {

}
