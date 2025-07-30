import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {MasterInfoType} from '../../../../../types/master-info.type';

@Component({
  selector: 'note-card3',
  imports: [
    NgClass
  ],
  standalone: true,
  templateUrl: './note-card3.component.html',
  styleUrl: './note-card3.component.scss'
})
export class NoteCard3Component {
  @Input() master: MasterInfoType | null = null;
  favorite: boolean = false;

  toggleFavorite() {
    this.favorite = !this.favorite;
  }

}
