import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'toInt'
})
export class ToIntPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    if (value == null) return '';
    const num = parseInt(value.toString().replace(/\s+/g, ''), 10);
    if (isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}
