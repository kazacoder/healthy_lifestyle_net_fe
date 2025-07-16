import { Component } from '@angular/core';
import {NoteCard3Component} from '../../../../shared/components/cards/note-card3/note-card3.component';

@Component({
  selector: 'app-favorite-masters',
  imports: [
    NoteCard3Component
  ],
  standalone: true,
  templateUrl: './favorite-masters.component.html',
  styleUrl: './favorite-masters.component.scss'
})
export class FavoriteMastersComponent {

}
