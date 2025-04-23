import {Component, HostListener, Input, ViewEncapsulation} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'event-card2',
  imports: [
    NgIf,
    NgClass
  ],
  standalone: true,
  templateUrl: './event-card2.component.html',
  styleUrl: './event-card2.component.scss',
})
export class EventCard2Component {
  @Input()
  event: {
    img: string,
    day: string,
    month: string,
    premium: string,
    price: string,
    avatar: string,
    master: string,
    city: string,
    title: string,
    desc: string,
    time: string,
    many: string,
  } | null = null;

  tagsOpen: boolean = false;

  private wasInside = false;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickOut() {
    if (!this.wasInside) {
      this.tagsOpen = false;
    }
    this.wasInside = false;
  }

  clickTagsButton() {
    this.tagsOpen = !this.tagsOpen;
  }
}
