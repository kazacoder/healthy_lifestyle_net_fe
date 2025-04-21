import { Component } from '@angular/core';
import {PosterInfoComponent} from '../../shared/components/events/poster-info/poster-info.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PosterInfoComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
