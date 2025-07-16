import {Component, Input} from '@angular/core';

@Component({
  selector: 'note-card2',
  imports: [],
  standalone: true,
  templateUrl: './note-card2.component.html',
  styleUrl: './note-card2.component.scss'
})
export class NoteCard2Component {
  @Input() title: string = '';
  @Input() image: string = '';

}
