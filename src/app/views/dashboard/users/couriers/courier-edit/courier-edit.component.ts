import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserControlsUpdateComponent } from '../../shared/user-controls-update/user-controls-update.component';
import { CourierFormComponent } from '../courier-form/courier-form.component';
import { CourierService } from '../courier.service';

@Component({
  selector: 'app-courier-edit',
  imports: [
    CourierFormComponent,
    ButtonComponent,
    UserControlsUpdateComponent
  ],
  templateUrl: './courier-edit.component.html',
  styleUrl: './courier-edit.component.scss'
})
export class CourierEditComponent implements OnDestroy, OnInit {

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;

  @Input() courier!: any;
  @Input() roles: any;

  faSave = faSave;

  constructor(
    private _courier: CourierService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.courier);
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      status: ['', [Validators.required]],
      is_cash_on_delivery: [null, [Validators.required]],
      is_freight_collect: [null, [Validators.required]],
      is_express_shipping: [null, [Validators.required]],
    });
  }

}
