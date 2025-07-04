import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WindowsUtils} from '../../../utils/windows-utils';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

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
export class SortComponent implements OnInit, OnDestroy {
  isDropdownOpen: boolean = false;
  componentClass = '.sort';

  @Input() sortOptions: { label: string, value: string }[] = [
    {label: 'По популярности', value: 'popularity'},
    {label: 'По стоимости', value: 'price'},
    {label: 'По дате', value: 'date'},
  ]

  currentSortOption: { label: string, value: string, desc: boolean } = {...this.sortOptions[0], desc: false};

  activatedRouterSubscription: Subscription | null = null;

  // Closing dropdown if click outside component
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (WindowsUtils.clickOutsideComponent(event, this.componentClass)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length === 0) {
        this.currentSortOption = {...this.sortOptions[0], desc: false};
      }
      let value = params['ordering']
      let desc = false;
      if (value) {
        if (value.slice(0, 1) === '-') {
          value = value.slice(1, value.length);
          desc = true;
        }
        const currentSortOption = this.sortOptions.filter(item => item.value === value)[0];
        this.currentSortOption = {...currentSortOption, desc: desc};
      }
    })
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  sortHandle(value: string, label: string) {
    if (this.currentSortOption.value === value && this.currentSortOption.value !== this.sortOptions[0].value) {
      this.currentSortOption.desc = !this.currentSortOption.desc;
    } else {
      this.currentSortOption.desc = false;
    }
    this.isDropdownOpen = false;
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams, ['ordering']: this.currentSortOption.desc ? '-' + value : value
    };

    this.currentSortOption.label = label;
    this.currentSortOption.value = value;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge'
    }).then();
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
  }
}
