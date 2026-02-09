import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PettyCashFormComponent } from '../petty-cash-form/petty-cash-form.component';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PettyCashService } from '../pettycash.service';

@Component({
  selector: 'app-petty-cash-edit',
  imports: [
    PettyCashFormComponent,
    ButtonSaveComponent
  ],
  templateUrl: './petty-cash-edit.component.html',
  styleUrl: './petty-cash-edit.component.scss'
})
export class PettyCashEditComponent implements OnInit{

  @Input() petty_cash: any; 

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _petty_cash: PettyCashService
  ){
  
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      amount_assigned: [null, [Validators.required]],
      employee_id: [null, [Validators.required]],
      gateway_id: [null, [Validators.required]],
      // other form controls
    });

    this.form.patchValue(this.petty_cash);

    console.log(this.petty_cash);
    

  }

  loading: boolean = false;

  update(){

    this.loading = true;

    this._petty_cash.update(this.petty_cash.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        console.log(resp);
        this.petty_cash = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al actualizar la caja. Inténtalo nuevamente.','error');
        this.loading = false;
        console.error(error);
      },
    
    });

  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}
