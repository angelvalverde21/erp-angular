import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-edit-price',
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-price.component.html',
  styleUrl: './edit-price.component.scss'
})
export class EditPriceComponent implements OnInit {


  @Input() variant: any;
  @Input() title: string = "";
  @Input() count_variant: number = 1000;

  @Input() is_collapsed: boolean = false;

  @Output() emitVariantPrice = new EventEmitter<any>();

  @Input() price_keys: string[] = [];

  set_price: number = 0;

  prices: any[] = [];

  constructor(
    private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.priceSubject
      .pipe(debounceTime(500))
      .subscribe(data => {
        console.log("Debounced:", data);
        // this.updatePrice(data);
        console.log('Variant single actualizada:', this.variant);
        this.emitVariantPrice.emit(data);
      });
  }

  form!: FormGroup;

  private priceSubject = new Subject<object>();


  ngOnChanges(): void {

    this.prices = this.price_keys.map(key => this.variant?.[key] ?? null);

    // Crear form reactivo dinámico
    this.form = this.fb.group({});

    this.price_keys.forEach((key, i) => {
      this.form.addControl(key, new FormControl(this.prices[i]));
    });

    this.form.valueChanges.subscribe((value: any) => {

      this.price_keys.forEach((key, index) => {
        this.variant[key] = value[key];
        console.log(key, value[key]);
      });



      // this.emitVariantPrice.emit(this.variant)
      //retrasa el envio de datos medio segundo
      this.priceSubject.next(this.variant);

    });

  }

}
