import {Component, Input} from '@angular/core';

@Component({
  selector: 'date-item',
  standalone: true,
  imports: [],
  templateUrl: './date-item.component.html',
  styleUrl: './date-item.component.scss'
})

export class DateItemComponent {
  @Input()
  date: {
    month: string,
    weekDay: string,
    date: string,
  } = {month: '', weekDay: '', date: ''};
}
