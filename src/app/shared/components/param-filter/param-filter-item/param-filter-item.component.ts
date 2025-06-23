import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
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
  @Input() search: boolean = false;
  @Input() multi: boolean = false;
  @Input() defaultOption: string | undefined = "Все"
  @Input() index: number = 0

  @Output() onDropdownOpen = new EventEmitter<boolean>(false);
  @Output() onChange = new EventEmitter<string[]>();

  selector: string = '';
  isDropdownOpen: boolean = false;
  selectedOptions: string[] = [];

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
      this.selectedOptions = [];
    }
  }

  toggleDropdown(event: Event | null = null): void {
    if (event?.target !== document.querySelector(`.filter-${this.index} .param-select__clear`)) {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.onDropdownOpen.emit(this.isDropdownOpen)
    }
  }

  clearFilter() {
    this.selectedOptions = [];
    this.onChange.emit(this.selectedOptions);
    this.isDropdownOpen = false;
    this.onDropdownOpen.emit(false)
  }

  isSelected(option: string): boolean {
    return this.selectedOptions.includes(option);
  }

  toggleOption(option: string) {
    if (this.multi) {
      const index = this.selectedOptions.indexOf(option);
      if (index >= 0) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }
    } else {
      this.selectedOptions = [option];
      this.isDropdownOpen = false;
    }
    this.onChange.emit(this.selectedOptions);
  }

  applyFilter() {
    this.isDropdownOpen = false;
    this.onDropdownOpen.emit(false)
  }

  get displayText(): string {
    return this.selectedOptions.length ? this.selectedOptions.join(', ') : this.filterTitle;
  }
}
