import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumTotal',
  standalone: true // Angular 18 standalone
})
export class SumTotalPipe implements PipeTransform {

  transform(items: any[], field: string = 'total'): number {
    if (!items || !Array.isArray(items)) return 0;

    return items.reduce(
      (acc, item) => acc + Number(item[field] || 0),
      0
    );
  }

}