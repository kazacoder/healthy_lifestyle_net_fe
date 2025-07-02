import {Component, Input, OnInit} from '@angular/core';
import {ParamFilterItemComponent} from './param-filter-item/param-filter-item.component';
import {NgClass, NgForOf, NgStyle} from '@angular/common';
import {FilterObjectType} from '../../../../types/filter-object.type';
import {Router} from '@angular/router';

@Component({
  selector: 'param-filter',
  imports: [
    ParamFilterItemComponent,
    NgForOf,
    NgStyle,
    NgClass
  ],
  standalone: true,
  templateUrl: './param-filter.component.html',
  styleUrl: './param-filter.component.scss'
})
export class ParamFilterComponent implements OnInit {

  zIndex: number = 0;
  filterOpened: boolean = false;

  @Input()
  filterObjects: FilterObjectType[] = []

  defaultOption: string = 'Все'

  constructor(private router: Router,) {
  }

  ngOnInit() {
    this.zIndex = window.innerWidth <= 992 ? 0 : 1
  }


  isFilterOpen(val: boolean) {
    if (window.innerWidth <= 992) {
      this.zIndex = val ? 7 : 0
      document.querySelector(".m-page")?.classList.toggle("fixed-body")
      document.querySelector(".m-page")?.classList.toggle("open-calendar")
    } else {
      this.zIndex = val ? 7 : 1
    }
    this.filterOpened = val;
  }

  clearAllFilters () {
    this.router.navigate([]).then();
  }

}
