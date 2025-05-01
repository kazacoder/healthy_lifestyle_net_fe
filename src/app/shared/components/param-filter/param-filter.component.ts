import {Component, Input} from '@angular/core';
import {ParamFilterItemComponent} from './param-filter-item/param-filter-item.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'param-filter',
  imports: [
    ParamFilterItemComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './param-filter.component.html',
  styleUrl: './param-filter.component.scss'
})
export class ParamFilterComponent {

  @Input()
  filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = []

  defaultOption: string = 'Все'

}
