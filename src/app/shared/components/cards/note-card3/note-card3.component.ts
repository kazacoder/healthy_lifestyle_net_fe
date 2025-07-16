import {Component, Input} from '@angular/core';

@Component({
  selector: 'note-card3',
  imports: [],
  standalone: true,
  templateUrl: './note-card3.component.html',
  styleUrl: './note-card3.component.scss'
})
export class NoteCard3Component {
  @Input() title: string = '';
  @Input() image: string = '';

}
