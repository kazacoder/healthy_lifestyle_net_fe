import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output
} from '@angular/core';
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
  @Input() currentCity: string = 'Любой'
  @Input() cities: string[] = [];
  @Output() onCitiChoice: EventEmitter<string> = new EventEmitter();

  isOpenDropDown = false;
  searchField: string = '';
  citiesFiltered: string[] = [];


  // Closing dropdown region select if click outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {

    if (!Array.from(document.querySelectorAll('.region-select')).some(node => {
       return node.contains(event.target as Node)
    })) {
      this.isOpenDropDown = false;
    }
  }

  ngOnChanges() {
    if (this.currentCity === 'Любой') {
      this.searchField = '';
    }
    this.citiesFiltered = [...this.cities]
  }

  filterCity() {
    const query = this.searchField.trim().toLowerCase();
    if (query) {
      this.citiesFiltered = this.cities.filter(city => city.toLowerCase().includes(query))
    } else {
      this.citiesFiltered = [...this.cities];
    }
  }

  regionSelectToggle() {
    this.isOpenDropDown = !this.isOpenDropDown;
  }

  setCity() {
    this.onCitiChoice.emit(this.currentCity);
    this.regionSelectToggle();
  }

}

