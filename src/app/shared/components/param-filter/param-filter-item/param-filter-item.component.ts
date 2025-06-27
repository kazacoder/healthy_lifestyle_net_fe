import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {WindowsUtils} from '../../../utils/windows-utils';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

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
export class ParamFilterItemComponent implements OnInit, OnDestroy {

  @Input() filterTitle: string = ''
  @Input() filterName: string = ''
  @Input() filterOptions: { id: string | number, title: string}[] = []
  @Input() search: boolean = false;
  @Input() multi: boolean = false;
  @Input() defaultOption: string | undefined = "Все"
  @Input() index: number = 0

  @Output() onDropdownOpen = new EventEmitter<boolean>(false);
  @Output() onChange = new EventEmitter<string[]>();

  selector: string = '';
  isDropdownOpen: boolean = false;
  selectedOptions: string[] = [];
  activatedRouterSubscription: Subscription | null = null;

  // Closing dropdown if click outside component
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (WindowsUtils.clickOutsideComponent(event, this.selector)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.selector = `.swiper-slide.param-select.filter-${this.index}`;
    if (this.defaultOption) {
      this.selectedOptions = [];
    }
    this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      const value = params[this.filterName];
      if (value) {
        this.selectedOptions = Array.isArray(value)
          ? value
          : [value];
      } else {
        this.selectedOptions = [];
      }
    })
  }

  getOptionById(id: number | string): string | null {
    if (this.selectedOptions.length === 0) {
      return null
    }
    const found = this.filterOptions.filter(item => item.id.toString() === id)
    return found[0].title
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

    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      [this.filterName]: null
    };

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge'
    }).then();
  }

  isSelected(option: string | number): boolean {
    return this.selectedOptions.includes(option.toString());
  }

  toggleOption(option: string | number) {
    if (this.multi) {
      const index = this.selectedOptions.indexOf(option.toString());
      if (index >= 0) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option.toString());
      }
    } else {
      this.selectedOptions = [option.toString()];
      this.isDropdownOpen = false;
      this.onDropdownOpen.emit(false)
    }
    this.onChange.emit(this.selectedOptions);

    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      [this.filterName]: this.selectedOptions.length ? this.selectedOptions : null
    };

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge'
    }).then();
  }

  applyFilter() {
    this.isDropdownOpen = false;
    this.onDropdownOpen.emit(false)
  }

  get displayText(): string {
    return this.selectedOptions.length ? this.selectedOptions.join(', ') : this.filterTitle;
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
  }
}
