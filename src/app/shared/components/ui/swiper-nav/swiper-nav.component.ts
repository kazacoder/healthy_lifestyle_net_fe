import {Component, Input} from '@angular/core';

@Component({
  selector: 'swiper-nav',
  imports: [],
  standalone: true,
  templateUrl: './swiper-nav.component.html',
  styleUrl: './swiper-nav.component.scss'
})
export class SwiperNavComponent {
  @Input() index: string = '';

}
