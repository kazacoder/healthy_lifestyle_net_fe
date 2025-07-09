import {Component, Input} from '@angular/core';

@Component({
  selector: 'note-card',
  imports: [],
  standalone: true,
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent {
  @Input() title: string | null = null;
  @Input() image: string | null = null;
}
