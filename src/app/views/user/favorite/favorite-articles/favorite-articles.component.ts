import { Component } from '@angular/core';
import {BlogCardComponent} from '../../../../shared/components/cards/blog-card/blog-card.component';

@Component({
  selector: 'app-favorite-articles',
  imports: [
    BlogCardComponent
  ],
  standalone: true,
  templateUrl: './favorite-articles.component.html',
  styleUrl: './favorite-articles.component.scss'
})
export class FavoriteArticlesComponent {

}
