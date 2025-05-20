import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'paragraphText'
})
export class ParagraphTextPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    let result = '';
    value?.split('\n')?.forEach(row => {
      result += `<p>${row}</p>`;
    })
    return result;
  }
}
