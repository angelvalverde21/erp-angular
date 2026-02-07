import { Component, EventEmitter, Output } from '@angular/core';
import { PettyCashFormComponent } from '../petty-cash-form/petty-cash-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { Subject, takeUntil } from 'rxjs';
import { PettyCashService } from '../pettycash.service';

@Component({
  selector: 'app-petty-cash-create',
  imports: [
    PettyCashFormComponent,
    ButtonSaveComponent
  ],
  templateUrl: './petty-cash-create.component.html',
  styleUrl: './petty-cash-create.component.scss'
})
export class PettyCashCreateComponent {

  form!: FormGroup;

  @Output() emitPettyCashCreate = new EventEmitter<any>();
  
  petty_cash: any;

  constructor(
    private fb: FormBuilder,
    private _petty_cash: PettyCashService
  ){

  }

  ngOnInit(): void {

    this.form = this.fb.group({
      amount_assigned: [null, [Validators.required]],
      employee_id: [null, [Validators.required]],
      // other form controls
    });

  }

  loading: boolean = false;

  create(){

    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this._petty_cash.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.petty_cash = resp.data;
        this.emitPettyCashCreate.emit(this.petty_cash);
        this.loading = false;
      },
    
      error: (error: any) => {
        console.error(error);
        this.loading = false;
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}
