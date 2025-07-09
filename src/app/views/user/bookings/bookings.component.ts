import { Component } from '@angular/core';
import {NoteCardComponent} from '../../../shared/components/cards/note-card/note-card.component';

@Component({
  selector: 'app-bookings',
  imports: [
    NoteCardComponent
  ],
  standalone: true,
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {

}
