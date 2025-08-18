import { Pipe, PipeTransform } from '@angular/core';
import {CommonUtils} from '../utils/common-utils';

@Pipe({
  standalone: true,
  name: 'numberToString'
})
export class NumberToStringPipe implements PipeTransform {

  transform(value: number | undefined, ...args: unknown[]): string {
    if (value) {
      return CommonUtils.getNewWord(value);
    }
    return '';
  }
}
