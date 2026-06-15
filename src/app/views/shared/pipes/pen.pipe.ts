import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pen',
  standalone: true
})
export class PenPipe implements PipeTransform {

  transform(value: number | string): string {

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return 'S/. 0.00';
    }

    const sign = numberValue < 0 ? '-' : '';
    const formattedValue = Math.abs(numberValue).toFixed(2);

    return ` ${sign} S/. ${formattedValue}`;
  }

}