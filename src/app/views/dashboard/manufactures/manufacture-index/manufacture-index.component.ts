import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-manufacture-index',
  imports: [],
  templateUrl: './manufacture-index.component.html',
  styleUrl: './manufacture-index.component.scss'
})
export class ManufactureIndexComponent {

  @Input() manufactures: any; 

}
