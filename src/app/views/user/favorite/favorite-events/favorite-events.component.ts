import { Component } from '@angular/core';
import {NoteCard2Component} from '../../../../shared/components/cards/note-card2/note-card2.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'favorite-events',
  imports: [
    NoteCard2Component,
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './favorite-events.component.html',
  styleUrl: './favorite-events.component.scss'
})
export class FavoriteEventsComponent {

}
