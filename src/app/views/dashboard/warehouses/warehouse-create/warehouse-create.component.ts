import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WarehouseService } from '../warehouse.service';
// fuentes
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faSave,
  faIdBadge,
} from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-warehouse-create',
  imports: [
    LoadingComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    CommonModule,
    JsonPipe
  ],
  templateUrl: './warehouse-create.component.html',
  styleUrl: './warehouse-create.component.scss',
})
export class WarehouseCreateComponent {
  faPenToSquare = faPenToSquare;
  faIdBadge = faIdBadge;
  faSave = faSave;
  subscription!: Subscription;

  @Output() emitWarehouse = new EventEmitter<[]>();

  constructor(private fb: FormBuilder, private _warehouse: WarehouseService) {}

  success: boolean = false;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  loading: boolean = false;

  warehouse: any;

  ngOnInit(): void {
    
    this.formInit();

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });
  }

  form!: FormGroup;

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  create() {
    this.subscription = this._warehouse
      .store(this.form.value)
      .subscribe((resp: any) => {
        console.log(resp);
        this.warehouse = resp.data;
        this.emitWarehouse.emit(resp.data);
      });
  }
}
