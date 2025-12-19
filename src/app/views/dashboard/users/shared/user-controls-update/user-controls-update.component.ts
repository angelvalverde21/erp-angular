import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faSave, faBan } from '@fortawesome/free-solid-svg-icons';
import { CustomerService } from '../../customers/customer.service';
import { SupplierService } from '../../suppliers/supplier.service';
import { EmployeeService } from '../../employees/employee.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
import { Resp } from 'src/app/interfaces/response.interface';

@Component({
  selector: 'app-user-controls-update',
  imports: [
    ButtonComponent,
    JsonPipe
  ],
  templateUrl: './user-controls-update.component.html',
  styleUrl: './user-controls-update.component.scss'
})
export class UserControlsUpdateComponent {

  @Input() type: string = 'customer'; // 'customer', 'employee', 'supplier'
  @Input() user_id: number = 0;
  @Input() formValue: any = {};

  faSave = faSave;
  faBan = faBan;

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private _customer: CustomerService,
    private _supplier: SupplierService,
    private _employee: EmployeeService
  ) { }

  private getService() {
    switch (this.type) {
      case 'supplier': return this._supplier;
      case 'employee': return this._employee;
      default: return this._customer;
    }
  }

  get status() {

    return Number(this.formValue.status) === 1 ? 'danger' : 'secondary';
  }

  get status_text() {
    return Number(this.formValue?.status ?? 0) === 1 ? 'Bloquear' : 'Desbloquear';
  }



  update() {

    const service = this.getService();

    this.disabledButton = true;
    this.loadingIcon = true;

    service.update(this.user_id, this.formValue).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al actualizar. Intentalo nuevamente.', 'error');
        console.error(error);
      },
    });

  }

  blocked() {

    console.log(this.formValue.status);

    const newStatus = Number(this.formValue.status) === 1 ? 0 : 1;
    const service = this.getService();

    this.disabledButton = true;
    this.loadingIcon = true;

    service.update(this.user_id, `{"status" :"${newStatus}"}`).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: Resp) => {

        this.formValue = resp.data

        console.log(this.formValue);
        console.log(this.formValue.status);


        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al actualizar. Intentalo nuevamente.', 'error');
        console.error(error);
      },
    });

  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }



}
