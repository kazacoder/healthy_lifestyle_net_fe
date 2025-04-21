import {Component, Input} from '@angular/core';



@Component({
  selector: 'poster-info',
  standalone: true,
  imports: [],
  templateUrl: './poster-info.component.html',
  styleUrl: './poster-info.component.scss'
})
export class PosterInfoComponent {

  @Input()
  title: string = '';

}
