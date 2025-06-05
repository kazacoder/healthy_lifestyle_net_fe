import {Component, Input} from '@angular/core';

@Component({
  selector: 'event-question-item',
  imports: [],
  standalone: true,
  templateUrl: './event-question-item.component.html',
  styleUrl: './event-question-item.component.scss'
})
export class EventQuestionItemComponent {
  @Input() name: string = '';

}
