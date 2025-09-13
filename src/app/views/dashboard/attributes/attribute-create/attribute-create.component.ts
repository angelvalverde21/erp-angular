import { Component, Input } from '@angular/core';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { UpperCaseDirective } from '../../../../core/directives/only-uppercase.directive';

@Component({
  selector: 'app-attribute-create',
  imports: [
    InputGroupComponent,
    ButtonComponent,
    ReactiveFormsModule,
    JsonPipe,
    UpperCaseDirective
  ],
  templateUrl: './attribute-create.component.html',
  styleUrl: './attribute-create.component.scss'
})
export class AttributeCreateComponent {

  @Input() product_id: number = 0;
  @Input() options: any[] = [];
  
  form!: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.options);
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['color'],
      value: [''],
    });
  }

  create() {

  }

}
