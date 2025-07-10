import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pen',
  standalone: true
})
export class PenPipe implements PipeTransform {


  transform(value: number): string {
    
    if (typeof value === 'number' && (value || value === 0)) {
      const formattedValue = value.toFixed(2); // Redondear a dos decimales
      return `S/. ${formattedValue}`; // Agregar el símbolo de la moneda
    }else{
      const numberValue = Number(value);
      const formattedValue = numberValue.toFixed(2);
      return `S/. ${formattedValue}`;

    }
    // return ''; // Manejar casos donde el valor no está definido o es null
  }

}
