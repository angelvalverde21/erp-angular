import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-price-main-edit',
  imports: [JsonPipe],
  templateUrl: './product-price-main-edit.component.html',
  styleUrl: './product-price-main-edit.component.scss'
})
export class ProductPriceMainEditComponent implements OnInit{

  @Input() variant: any; 
  @Input() product_id: number = 0; 

  @Input() current_product_id: number = 0;
  @Input() title: string = "";

  prices: any[] = [];

  saveTrack_id: number = 0;

  constructor(){

  }

  ngOnInit(): void {

    // console.log(this.variant);
    this.prices = [this.variant?.price_normal, this.variant?.price_feria, this.variant?.price_wholesaler, this.variant?.price_live, this.variant?.price_blackfriday];
    // console.log(this.prices);

    console.log(this.current_product_id);
    
  }

}

