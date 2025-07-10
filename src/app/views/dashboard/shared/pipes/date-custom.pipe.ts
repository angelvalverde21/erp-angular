import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCustom',
  standalone: true
})

export class DateCustomPipe implements PipeTransform {

  transform(value: string | Date): string {
    const date = new Date(value);

    // Obtener partes de la fecha
    const day = this.addLeadingZero(date.getDate());
    const month = this.addLeadingZero(date.getMonth() + 1); // Los meses empiezan desde 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = this.addLeadingZero(date.getMinutes());

    // Convertir formato 24 horas a 12 horas y determinar AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12; // Si es 0 horas, se convierte en 12 AM

    return `${day}-${month}-${year} ${hours12}:${minutes} ${period}`;
  }

  // Método auxiliar para agregar un cero antes si es necesario
  private addLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

}
