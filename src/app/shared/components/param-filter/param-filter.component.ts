import {Component, Input} from '@angular/core';
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
export class ParamFilterComponent {

  zIndex: number = 1;

  @Input()
  filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = []

  defaultOption: string = 'Все'

  isFilterOpen(val: boolean) {
    if(window.innerWidth <= 992){
      this.zIndex = val ? 7 : 1
      console.log(this.zIndex)
      document.querySelector(".m-page")?.classList.toggle("fixed-body")
      document.querySelector(".m-page")?.classList.toggle("open-calendar")
    }
  }

}
