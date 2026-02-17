import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@buttons/button/button.component';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'tr[app-kardex-index-selected-row]',
  imports: [
    FontAwesomeModule,
    ButtonComponent,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './kardex-index-selected-row.component.html',
  styleUrl: './kardex-index-selected-row.component.scss'
})
export class KardexIndexSelectedRowComponent implements OnInit {

  faBarcode = faBarcode;
  faCheck = faCheck;
  @Input() variant: any;
  @Input() color_check: string = 'success';


  form!: FormGroup;

  @Output() emitVariantKardex = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder
  ) {

  }

  comments: string[] = [];
  comment: string = '';

  ngOnInit(): void {


    switch (this.color_check) {
      case "danger":
        this.comment = "Fallado";
        break;
      case "success":
        this.comment = "Recepcion";
        break;
      case "warning":
        this.comment = "Reparado";
        break;
    
      default:
        this.comment = "No determinado";
        break;
    }

    this.formInit();

    this.form.valueChanges.subscribe(value => {
      console.log(value);
      this.emitVariantKardex.emit(value);
    });

  }


  formInit() {

    this.form = this.fb.group({
      variant_id: [this.variant.id, Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      comment: [this.comment, Validators.required]
    });

  }

}
