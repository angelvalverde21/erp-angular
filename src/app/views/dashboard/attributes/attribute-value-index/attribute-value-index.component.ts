import { Component, Input } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-attribute-value-index',
  imports: [ButtonComponent, JsonPipe],
  templateUrl: './attribute-value-index.component.html',
  styleUrl: './attribute-value-index.component.scss'
})
export class AttributeValueIndexComponent {

  faTrash = faTrash

  @Input() attributes: any[] = []; 

}

