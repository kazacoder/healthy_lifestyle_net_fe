import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-favorite',
  imports: [
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
