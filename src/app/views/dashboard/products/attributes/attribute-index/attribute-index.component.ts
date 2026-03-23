import { Component, Input, OnInit } from '@angular/core';
import { AttributeCreateComponent } from '../attribute-create/attribute-create.component';
import { JsonPipe } from '@angular/common';
import { AttributeRowComponent } from '../attribute-row/attribute-row.component';

@Component({
  selector: 'app-attribute-index',
  imports: [
    AttributeCreateComponent,
    AttributeRowComponent,
    JsonPipe
  ],
  templateUrl: './attribute-index.component.html',
  styleUrl: './attribute-index.component.scss'
})
export class AttributeIndexComponent implements OnInit {

  ngOnInit(): void {

    this.attributes.forEach((attribute: any) => {
      this.attributes_init = this.attributes_init.filter(
        (attr: any) => attr.name !== attribute.name
      );
    });

    console.log(this.attributes_init);
    
  }


  @Input() attributes_init: any;
  @Input() attributes: any;
  @Input() product_id: number = 0;

  removeAttribute(attributeRemove: any) {

    console.log("attributo a remover");
    
    console.log(attributeRemove);

    /*
    {
      "store_id": 1,
      "product_id": "582",
      "name": "Marca",
      "value": "SORELLE",
      "sort_order": 1,
      "updated_at": "2025-12-30T20:48:05.000000Z",
      "created_at": "2025-12-30T20:48:05.000000Z",
      "id": 4
    }
    */

    this.attributes_init = this.attributes_init.filter(
      (attr: any) => attr.name !== attributeRemove.name
    );

  }


  receiveDeleteStatus(removeAttribute: any) {
    console.log(removeAttribute);
    
    this.attributes = this.attributes.filter((attribute: any) => attribute.name !== removeAttribute.name);

    this.attributes_init = [...this.attributes_init, removeAttribute];
  }

  receiveAttribute(event: any) {

    console.log(event);
    

    this.attributes = [...this.attributes, event];

    this.removeAttribute(event);
  }

}

