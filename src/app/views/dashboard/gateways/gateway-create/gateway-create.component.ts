import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GatewayFormComponent } from '../gateway-form/gateway-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { GatewayService } from '../gateway.service';

@Component({
  selector: 'app-gateway-create',
  imports: [
    GatewayFormComponent,
    ButtonSaveComponent
  ],
  templateUrl: './gateway-create.component.html',
  styleUrl: './gateway-create.component.scss'
})
export class GatewayCreateComponent implements OnInit {

  form!: FormGroup;

  @Output() emitGatewayCreate = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private _gateway: GatewayService
  ) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required]
    });
  }

  loading: boolean = false;
  gateway: any;

  create(){

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: 'Espere...',
      html: 'Creando registro',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })
    

    this._gateway.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Registro Creado',
        })
        
        console.log(resp);
        this.gateway = resp.data;
        this.loading = false;
        this.emitGatewayCreate.emit(this.gateway);
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
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
