import {Component, HostListener, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {WindowsUtils} from '../../../utils/windows-utils';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'param-filter-item',
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    FormsModule
  ],
  standalone: true,
  templateUrl: './param-filter-item.component.html',
  styleUrl: './param-filter-item.component.scss'
})
export class ParamFilterItemComponent implements OnInit {

  @Input() filterTitle: string = ''
  @Input() filterOptions: string[] = []
  @Input() search: boolean = false
  @Input() defaultOption: string | undefined = "Все"
  @Input() index: number = 0

  selector: string = '';
  isDropdownOpen: boolean = false;
  selectedOption: string = '';

  // Closing dropdown if click outside component
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (WindowsUtils.clickOutsideComponent(event, this.selector)) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit() {
    this.selector = `.swiper-slide.param-select.filter-${this.index}`;
    if (this.defaultOption) {
      this.selectedOption = this.filterTitle
    }
  }

  toggleDropdown(event: Event | null = null): void {
    if (event?.target !== document.querySelector(`.filter-${this.index} .param-select__clear`)) {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }

  clearFilter() {
    this.selectedOption = this.filterTitle;
    this.isDropdownOpen = false;
  }
}
