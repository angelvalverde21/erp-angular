import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from "src/app/views/shared/components/buttons/button/button.component";
import { Subject, takeUntil } from 'rxjs';
import { KardexService } from '../../../kardex/kardex.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { KardexIndexComponent } from '../../../kardex/kardex-index/kardex-index.component';
import { InputGroupComponent } from 'src/app/views/shared/components/form/input-group/input-group.component';

@Component({
  selector: 'app-inventory-barcode-search',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    ButtonComponent,
    LoadingComponent,
    KardexIndexComponent,
    InputGroupComponent
],
  templateUrl: './inventory-barcode-search.component.html',
  styleUrl: './inventory-barcode-search.component.scss'
})
export class InventoryBarcodeSearchComponent implements OnInit{


  faBarcode = faBarcode;

  loading: boolean = false;

  kardexes: any[] = []; 

  @Input() barcode: string = ''; 

    form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _kardex: KardexService
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

    console.log("Form value:", this.form.value);
    

    if(this.form.valid){

      const barcode = this.form.get('barcode')?.value;
      console.log('Searching for barcode:', barcode);

      this.loading = true;
      
      this._kardex.getVariants(barcode).pipe(takeUntil(this.destroy$)).subscribe({
      
        next: (resp: any) => {
          console.log(resp);
          this.kardexes = resp.data;
          this.loading = false;
        },
      
        error: (error: any) => {
          Swal.fire('Error','Ocurrió un problema al buscar. Inténtalo nuevamente.','error');
          console.error(error);
        },
      
      });

    }
  }
  
  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}

  
