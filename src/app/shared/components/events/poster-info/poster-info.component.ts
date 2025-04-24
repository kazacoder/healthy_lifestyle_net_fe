import {Component, EventEmitter, Input, Output} from '@angular/core';



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
  @Input()
  currentCity: string = '';

  @Output() onAllCityModalButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>(false);


  allCityModalOpen() {
    this.onAllCityModalButtonClick.emit(true);
  }

}
