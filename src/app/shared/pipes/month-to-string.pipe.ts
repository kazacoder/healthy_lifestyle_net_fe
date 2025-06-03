import { Pipe, PipeTransform } from '@angular/core';
import {CommonUtils} from '../utils/common-utils';

@Pipe({
  standalone: true,
  name: 'monthToString'
})
export class MonthToStringPipe implements PipeTransform {

  transform(value: number | undefined, ...args: unknown[]): string {
    if (value) {
      return CommonUtils.getRussianMonthName(value.toString());
    }
    return '';
  }

}
