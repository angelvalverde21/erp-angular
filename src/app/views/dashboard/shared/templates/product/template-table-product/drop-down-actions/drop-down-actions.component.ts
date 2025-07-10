
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective
} from '@coreui/angular';

import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../core/environments/environment';



@Component({
  selector: 'app-drop-down-actions',
  imports: [
    ButtonDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    RouterLink,
    CommonModule
  ],
  templateUrl: './drop-down-actions.component.html',
  styleUrl: './drop-down-actions.component.scss'
})




export class DropDownActionsComponent implements OnInit{

  @Input() color: string | null = "dark"; 
  @Input() product: any;
  // showStoreNameInSlug: boolean = false;
  items: any;

  constructor(){

  }

  ngOnInit(): void {

    console.log(this.product);

    const prefix = environment.showStoreNameInSlug ? ['/', environment.storeName, 'products'] : [];
    
    this.items = [
      {
        "text" : "Editar",
        "icon" : "fa-solid fa-pen",
        "link" : [ 
           
           
           
           , this.product.id]
      },
      {
        "text" : "Ver Online",
        "icon" : "fa-solid fa-globe",
        "link" : [...prefix, 'online', this.product.id]
      },
      // {
      //   "text" : "Almacenes",
      //   "icon" : "fa-solid fa-warehouse",
      //   "link" : [...prefix, 'warehouses', this.product.id]
      // },
      {
        "text" : "Reportes",
        "icon" : "fa-solid fa-chart-simple",
        "link" : [...prefix, 'reports', this.product.id]
      }
    ]

    if (environment.storeName != null) {

    }

  }
  
}
