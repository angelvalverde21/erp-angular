import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
  faPenToSquare,
  faRulerCombined,
  faSave,
  faCamera,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { BatchService } from '../batch.service';
import { BatchSectionsComponent } from './../batch-sections/batch-sections.component';
import { SumTotalPipe } from '../../shared/pipes/sum-total.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyImgDirective } from '../../../../core/directives/lazy-img/lazy-img.directive';

@Component({
  selector: 'app-batch-edit',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    LoadingComponent,
    BatchSectionsComponent,
    SumTotalPipe,
    CommonModule,
    FontAwesomeModule,
    NgbAccordionModule,
    GalleryComponent,
    LazyImgDirective,
  ],
  templateUrl: './batch-edit.component.html',
  styleUrl: './batch-edit.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BatchEditComponent implements OnInit, OnDestroy {
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = true;
  success: boolean = false;
  url_thumbnail_placeholder: string = 'https://placehold.co/400x550';

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faAddressCard = faAddressCard;
  faPenToSquare = faPenToSquare;
  faSave = faSave;
  faCamera = faCamera;
  faImages = faImages;

  faRulerCombined = faRulerCombined;

  units: any[] = [];

  @Input() batch_id: number = 0;

  batch: any;

  @Output() emitBatchCreate = new EventEmitter<any | boolean>();

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _batch: BatchService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

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

  calculoPrendasAprovadas() {
    this.prendasAprovadas =
      Number(this.form.get('quantity_total')?.value) -
      Number(this.form.get('quantity_waste')?.value);
    console.log(this.prendasAprovadas);
  }

  caclculoCostoProduccion() {
    const cantidad = Number(this.prendasAprovadas) || 0;
    this.costoProduccion = cantidad ? +(this.total / cantidad).toFixed(2) : 0;
  }

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }

  closeModal() {
    this.modal.close();
  }

  reReloadImageBatch(event: any) {
    console.log(event);
    this.url_thumbnail_placeholder = event.url_thumbnail;
    
  }
}
