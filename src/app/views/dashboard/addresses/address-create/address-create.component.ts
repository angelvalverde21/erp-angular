import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressFormComponent } from '../address-form/address-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-create',
  imports: [
    AddressFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './address-create.component.html',
  styleUrl: './address-create.component.scss'
})
export class AddressCreateComponent implements OnInit, OnDestroy {

  form!: FormGroup

  constructor(
    private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.formInit();

    // this.form.statusChanges.subscribe((status) => {
    //   console.log(status);
    // });

  }
  ngOnDestroy(): void {

  }

  formInit() {

    this.form = this.fb.group({

      name:         ['', [Validators.required]],
      primary:      ['', [Validators.required]],
      secondary:    [''],
      district_id:  ['', [Validators.required]],
      phone:        ['', [Validators.required]],
      references:   ['', [Validators.required]],

    });

  }

}
