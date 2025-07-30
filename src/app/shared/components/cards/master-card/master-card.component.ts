import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MasterInfoType} from '../../../../../types/master-info.type';

@Component({
  selector: 'master-card',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './master-card.component.html',
  styleUrl: './master-card.component.scss'
})
export class MasterCardComponent {
  tagsOpen: boolean = false;
  favorite: boolean = false;

  @Input()
  master: MasterInfoType | null = null;

  tagButtonProceed() {
    this.tagsOpen = !this.tagsOpen;
  }

  toggleFavorite() {
    this.favorite = !this.favorite;
  }

}

