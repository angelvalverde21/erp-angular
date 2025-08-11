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
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { BatcheService } from '../batche.service';
import { IdentitySelectedComponent } from '../../identities/identity-selected/identity-selected.component';

@Component({
  selector: 'app-batche-edit',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    IdentitySelectedComponent,
    JsonPipe,
    LoadingComponent,
  ],
  templateUrl: './batche-edit.component.html',
  styleUrl: './batche-edit.component.scss'
})
export class BatcheEditComponent implements OnInit, OnDestroy{

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
  units: any[] = [];

  @Input() batche_id: number = 0;

  batche: any;

  @Output() emitBatcheCreate = new EventEmitter<any | boolean>();

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private _batche: BatcheService) {}

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formInit();
    this.loadbatche();

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

  loadbatche() {
    this._batche.get(this.batche_id).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      console.log(resp.data);
      this.form.patchValue(resp.data);
      this.batche = resp.data;
      //  console.log(this.batche.category);
      this.loading = false;
    });
  }

  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._batche.update(this.batche_id, this.form.value).subscribe({
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

}
