import { Component } from '@angular/core';
import {PosterInfoComponent} from '../../shared/components/events/poster-info/poster-info.component';
import {DateFeedComponent} from '../../shared/components/page-blocks/date-feed/date-feed.component';
import {NgIf} from '@angular/common';
import {DateFilterComponent} from '../../shared/components/page-blocks/date-filter/date-filter.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PosterInfoComponent, DateFeedComponent, NgIf, DateFilterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
