import {Component, HostListener} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WindowsUtils} from '../../../utils/windows-utils';

@Component({
  selector: 'sort',
  imports: [
    NgClass,
    FormsModule,
    NgForOf
  ],
  standalone: true,
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent {
  isDropdownOpen: boolean = false;
  componentClass = '.sort';

  eventSortOptions: string[] = ['По популярности', 'По стоимости' ,'По дате']

  eventSort: string = this.eventSortOptions[0];

  // Closing dropdown if click outside component
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (WindowsUtils.clickOutsideComponent(event, this.componentClass)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  sortHandle() {
    this.isDropdownOpen = false;
  }
}
