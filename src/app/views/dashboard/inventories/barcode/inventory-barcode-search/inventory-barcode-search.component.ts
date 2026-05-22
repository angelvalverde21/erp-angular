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
import { ButtonPrintBarcodeComponent } from 'src/app/views/shared/components/buttons/button-print-barcode/button-print-barcode.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BarcodeIndexComponent } from '../../../barcodes/barcode-index/barcode-index.component';


@Component({
  selector: 'app-inventory-barcode-search',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    ButtonComponent,
    LoadingComponent,
    KardexIndexComponent,
    InputGroupComponent,
    ButtonPrintBarcodeComponent,
    BarcodeIndexComponent
  ],
  templateUrl: './inventory-barcode-search.component.html',
  styleUrl: './inventory-barcode-search.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InventoryBarcodeSearchComponent implements OnInit {


  faBarcode = faBarcode;

  loading: boolean = false;

  kardexes: any[] = [];

  variants: any[] = [];

  variant: any = null;

  @Input() barcode: string = '';

  form!: FormGroup;


  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _kardex: KardexService
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      barcode: [this.barcode]
    });
  }

  search() {

    console.log("Form value:", this.form.value);


    if (this.form.valid) {

      const barcode = this.form.get('barcode')?.value;
      console.log('Searching for barcode:', barcode);

      this.loading = true;

      this._kardex.getVariants(barcode).pipe(takeUntil(this.destroy$)).subscribe({

        next: (resp: any) => {
          console.log(resp);
          this.kardexes = resp.data;

          //extrayendo la variante de los kardexes
          this.variant = this.kardexes.length > 0
            ? this.kardexes[0].variant
            : null;

          this.variants = this.variant ? [this.variant] : [];

          console.log(this.variant);
          

          this.loading = false;
        },

        error: (error: any) => {
          Swal.fire('Error', 'Ocurrió un problema al buscar. Inténtalo nuevamente.', 'error');
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

  closeModal() {
    this.modal.close();
  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


}
