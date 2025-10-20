import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNameSize',
  standalone: true
})
export class ShortNameSizePipe implements PipeTransform {

  transform(value: string): string {
    if (typeof value !== 'string') {
      return ''; // Retorna una cadena vacía si el valor no es una cadena
    }
    return value.substring(0, 3).toUpperCase();
  }

}
