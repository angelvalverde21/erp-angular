import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-attribute-index',
  imports: [],
  templateUrl: './attribute-index.component.html',
  styleUrl: './attribute-index.component.scss'
})
export class AttributeIndexComponent {

  @Input() attributes: any[] = []; 

}
