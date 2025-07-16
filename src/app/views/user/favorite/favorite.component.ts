import { Component } from '@angular/core';
import {NoteCard2Component} from '../../../shared/components/cards/note-card2/note-card2.component';
import {NoteCard3Component} from '../../../shared/components/cards/note-card3/note-card3.component';
import {BlogCardComponent} from '../../../shared/components/cards/blog-card/blog-card.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-favorite',
  imports: [
    NoteCard2Component,
    NoteCard3Component,
    BlogCardComponent,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  standalone: true,
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent {

}
