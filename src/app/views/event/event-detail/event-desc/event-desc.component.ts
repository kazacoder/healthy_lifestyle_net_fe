import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {SwiperNavComponent} from '../../../../shared/components/ui/swiper-nav/swiper-nav.component';

@Component({
  selector: 'event-desc',
  imports: [
    NgIf,
    SwiperNavComponent
  ],
  standalone: true,
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss'
})
export class EventDescComponent {

  already: boolean = false;

}
