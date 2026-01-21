import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-edit-price-cascade',
  imports: [],
  templateUrl: './edit-price-cascade.component.html',
  styleUrl: './edit-price-cascade.component.scss'
})
export class EditPriceCascadeComponent implements OnInit {


  @Input() variant: any;
  @Input() title: string = "";
  @Input() is_collapsed: boolean = false;
  @Input() price_keys: string[] = [];
  @Input() count_variants: number = 0;

  @Output() emitVariantPrice = new EventEmitter<any>();

  set_price: number = 0;

  prices: any[] = [];

  private priceSubject = new Subject<object>();


  ngOnInit(): void {
    this.prices = this.price_keys.map(key => this.variant?.[key] ?? null);

    this.priceSubject
      .pipe(debounceTime(500))
      .subscribe(data => {
        console.log("Debounced:", data);
        // this.updatePrice(data);
        this.emitVariantPrice.emit(data);
      });
  }

  setPrice(event: any, index: number) {

    const value = event.target.value;
    const key = this.price_keys[index];

    // console.log(value);
    // console.log(index);
    // console.log(key);

    const obj = {
      [key]: value
    };

    console.log(obj);

    this.priceSubject.next(obj); //se va a suscribe para que se ejecute cada x milisegundos
    // this.emitVariantPrice.emit(obj);

  }

}
