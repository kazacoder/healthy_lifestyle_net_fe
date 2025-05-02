import {Component, Input} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'blog-card',
  imports: [
    NgForOf,
    NgClass,
    RouterLink
  ],
  standalone: true,
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss'
})
export class BlogCardComponent {
  @Input() date: { day: string, month: string } = { day: '', month: '' };
  @Input() tags: { title: string, img: string }[] = [];
  @Input() img: string = '';
  @Input() type: string = '';
  @Input() favorite: boolean = false;
  @Input() text: string = '';

  toggleFavorite() {
    this.favorite = !this.favorite;
  }
}
