import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'param-filter-item',
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './param-filter-item.component.html',
  styleUrl: './param-filter-item.component.scss'
})
export class ParamFilterItemComponent {

  @Input()
  filterTitle: string = ''

  @Input()
  filterOptions: string[] = []

  @Input()
  search: boolean = false

  @Input()
  defaultOption: string | undefined = "Все"

  @Input()
  index: number = 0

  isDropdownOpen: boolean = false;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('asd');
  }
}
