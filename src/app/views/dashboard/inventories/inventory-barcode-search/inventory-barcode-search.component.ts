import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from "src/app/views/shared/components/buttons/button/button.component";

@Component({
  selector: 'app-inventory-barcode-search',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    ButtonComponent
],
  templateUrl: './inventory-barcode-search.component.html',
  styleUrl: './inventory-barcode-search.component.scss'
})
export class InventoryBarcodeSearchComponent implements OnInit{


  faBarcode = faBarcode;

  @Input() barcode: string = ''; 

    form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ){
  
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit(){
    this.form = this.fb.group({
      barcode: [this.barcode]
    });
  }

  search(){
    if(this.form.valid){
      const barcode = this.form.get('barcode')?.value;
      console.log('Searching for barcode:', barcode);
    }
  }

}

  
