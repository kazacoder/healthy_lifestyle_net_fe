import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'master-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './master-card.component.html',
  styleUrl: './master-card.component.scss'
})
export class MasterCardComponent {
  tagsOpen: boolean = false;

  @Input()
  master: {
    img: string,
    city: string,
    title: string,
    desc: string,
  } | null = null;

  tagButtonProceed() {
    this.tagsOpen = !this.tagsOpen;
  }

}

