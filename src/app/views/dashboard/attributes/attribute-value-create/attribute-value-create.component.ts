import { Component, Input } from '@angular/core';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { UpperCaseDirective } from '../../../../core/directives/only-uppercase.directive';
import { AttributeValueService } from '../attribute-value.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attribute-value-create',
  imports: [
    InputGroupComponent,
    ButtonComponent,
    ReactiveFormsModule,
    JsonPipe,
    UpperCaseDirective
  ],
  templateUrl: './attribute-value-create.component.html',
  styleUrl: './attribute-value-create.component.scss'
})
export class AttributeValueCreateComponent {

  @Input() product_id: number = 0;
  @Input() options: any[] = [];
  @Input() attributes: any[] = [];
  attributeValue: any;
  loading: boolean = false;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private _attribute_value: AttributeValueService) {

  }

  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.options);
  }

  private formInit(): void {
    this.form = this.fb.group({
      attribute_id: [1],
      value: [''],
    });
  }

  create() {


    // console.log(this.form.value);
    

    this._attribute_value.store(this.product_id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.attributeValue = resp.data;
        this.loading = false;
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
