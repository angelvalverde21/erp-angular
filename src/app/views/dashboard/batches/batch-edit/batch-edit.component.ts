import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
  faPenToSquare,
  faRulerCombined,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { BatchService } from '../batch.service';
import { IdentitySelectedComponent } from '../../identities/identity-selected/identity-selected.component';
import { BatchSectionsComponent } from './../batch-sections/batch-sections.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetsDropdownComponent } from '../../../widgets/widgets-dropdown/widgets-dropdown.component';
import { SumTotalPipe } from '../../shared/pipes/sum-total.pipe';

@Component({
  selector: 'app-batch-edit',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    IdentitySelectedComponent,
    JsonPipe,
    LoadingComponent,
    BatchSectionsComponent,
    FontAwesomeModule,
    NgbAccordionModule,
    WidgetsDropdownComponent,
    SumTotalPipe,
    CommonModule
  ],
  templateUrl: './batch-edit.component.html',
  styleUrl: './batch-edit.component.scss',
})
export class BatchEditComponent implements OnInit, OnDestroy {
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = true;
  success: boolean = false;

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faAddressCard = faAddressCard;
  faPenToSquare = faPenToSquare;

  faRulerCombined = faRulerCombined;

  units: any[] = [];

  @Input() batch_id: number = 0;

  batch: any;

  @Output() emitBatchCreate = new EventEmitter<any | boolean>();

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private _batch: BatchService) {}

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      quantity_total: [''],
      quantity_waste: [''],
    });
  }

  ngOnInit(): void {
    this.formInit();
    this.loadbatch();

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

    //recibir cambios del categoria
  }

  loadbatch() {
    this._batch
      .get(this.batch_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        console.log(resp.data);
        this.form.patchValue(resp.data);
        this.batch = resp.data;
        //  console.log(this.batch.category);
        this.calculoTotal();
        this.calculoPrendasAprovadas();
        this.caclculoCostoProduccion();
        this.loading = false;
      });
  }

  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._batch.update(this.batch_id, this.form.value).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        this.success = true;
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al actualizar. Inténtalo nuevamente.',
          'error'
        );
        console.error(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  total: number = 0;
  costoProduccion: number = 0;
  prendasAprovadas: number = 0;

  calculoTotal() {
    this.batch.section.childrens.forEach((children: any) => {
      children.purchases.forEach((purchase: any) => {
        const totalNum = Number(purchase.total) || 0; // conversión segura
        this.total += totalNum;
      });
    });
  }

  calculoPrendasAprovadas(){
    this.prendasAprovadas = Number(this.form.get('quantity_total')?.value) - Number(this.form.get('quantity_waste')?.value);
    console.log(this.prendasAprovadas);
  }

  caclculoCostoProduccion() {
    const cantidad = Number(this.prendasAprovadas) || 0;
    this.costoProduccion = cantidad ? +(this.total / cantidad).toFixed(2) : 0;
  }
}
