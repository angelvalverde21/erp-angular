import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import Swal from 'sweetalert2';
import { UpperCaseDirective } from '../../../../core/directives/only-uppercase.directive';
import { ColorService } from '../color.service';
import { Color } from '../color.interface';

@Component({
  selector: 'app-color-create',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    JsonPipe,
    UpperCaseDirective
  ],
  templateUrl: './color-create.component.html',
  styleUrl: './color-create.component.scss'
})
export class ColorCreateComponent {

  @Input() product_id: number = 0;
  @Output() emitColorCreate = new EventEmitter<Color>();

  constructor(private fb: FormBuilder, private _color: ColorService) {

  }

  faPlus = faPlus;

  disabledButton: boolean = true;
  destroy$ = new Subject<void>();

  ngOnInit(): void {

    this.formInit();

    this.form.valueChanges.subscribe((value: string) => {
      console.log(value);
    });

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  form!: FormGroup;

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loading: boolean = false;

  create() {

    this.loading = true;

    const nameControl = this.form.get('name');

    // console.log('Size upload event:', this.form.value);

    nameControl?.disable();

    this._color.store(this.product_id, this.form.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.emitColorCreate.emit(resp.data);
        this.loading = false;
        nameControl?.enable();
        nameControl?.setValue('');
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
        nameControl?.enable();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
        });

      },
    });

  }

}
