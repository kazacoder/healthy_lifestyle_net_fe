import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'region-select',
  imports: [
    NgClass,
    NgForOf,
    FormsModule
  ],
  standalone: true,
  templateUrl: './region-select.component.html',
  styleUrl: './region-select.component.scss'
})
export class RegionSelectComponent implements OnChanges {
  isOpenDropDown = false;
  @Input() currentCity: string = 'Любой'
  @Input() cities: string[] = [];
  @Output() onCitiChoice: EventEmitter<string> = new EventEmitter();


  // Todo доделать
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentCity']) {
      this.currentCity = changes['currentCity'].currentValue
      console.log(changes['currentCity'].currentValue)
      console.log(this.currentCity)
    }
  }

  regionSelectToggle() {
    this.isOpenDropDown = !this.isOpenDropDown;
  }

  setCity() {
    this.onCitiChoice.emit(this.currentCity);
  }

}

