import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { SupplierService } from '../supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserControlsUpdateComponent } from '../../shared/user-controls-update/user-controls-update.component';

@Component({
  selector: 'app-supplier-edit',
  imports: [
    SupplierFormComponent,
    ButtonComponent,
    UserControlsUpdateComponent
  ],
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.scss'
})
export class SupplierEditComponent implements OnDestroy, OnInit {

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;

  @Input() supplier!: any;
  @Input() roles: any;

  faSave = faSave;

  constructor(
    private _supplier: SupplierService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.supplier);
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
      roles: ['', [Validators.required]],
    });
  }

}
