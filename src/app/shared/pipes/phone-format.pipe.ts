import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    // Убираем все не цифры
    const digits = value.replace(/\D/g, '');

    // Добавляем +7 и форматируем
    if (digits.length === 10) {
      return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    }

    // Если уже с "7" или "8" в начале
    if (digits.length === 11) {
      return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
    }

    // fallback — возвращаем как есть
    return `+${digits}`;
  }

}
