import {Component, Input, OnInit} from '@angular/core';
import {ParamFilterItemComponent} from './param-filter-item/param-filter-item.component';
import {NgForOf, NgStyle} from '@angular/common';

@Component({
  selector: 'param-filter',
  imports: [
    ParamFilterItemComponent,
    NgForOf,
    NgStyle
  ],
  standalone: true,
  templateUrl: './param-filter.component.html',
  styleUrl: './param-filter.component.scss'
})
export class ParamFilterComponent implements OnInit {

  zIndex: number = 0;

  @Input()
  filterObjects: { title: string, options: string[], search: boolean, defaultOption?: string, multi?: boolean }[] = []

  defaultOption: string = 'Все'

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
  }

}
