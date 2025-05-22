import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  PublicationCardComponent
} from '../../../../../shared/components/cards/publication-card/publication-card.component';

@Component({
  selector: 'app-publications',
  imports: [
    RouterLink,
    PublicationCardComponent
  ],
  standalone: true,
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent {

}
