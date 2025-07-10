import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slug',
  standalone: true
})
export class SlugPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value
      .toLowerCase() // Convertir a minúsculas
      .trim() // Eliminar espacios al principio y al final
      .replace(/[\s\W-]+/g, '-') // Reemplazar espacios y caracteres no alfanuméricos por guiones
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al principio y al final
  }

}
