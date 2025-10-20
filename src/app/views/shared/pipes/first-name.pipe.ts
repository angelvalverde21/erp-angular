import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName',
  standalone: true
})
export class FirstNamePipe implements PipeTransform {

  arrayName: any = [];

  transform(name: string): unknown {

    //this.arrayTitle = title.split('-');
    this.arrayName  = name.split(' ');
    // console.log(title);
    return this.arrayName[0];
    
  }

}


