import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faGear,
  faSave,
  faShirt,
  faTags,
  faIdBadge,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { faImage, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-user-edit',
  imports: [
    FontAwesomeModule,
    ButtonComponent,
    InputGroupComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit{

  constructor(
      private fb: FormBuilder
  ){
  
  }

  
  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  
  form!: FormGroup;
  @Input() user: User[] = []; 

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
    });
  }

  faPenToSquare = faPenToSquare;
  faImage = faImage;
  faGear = faGear;
  faSave = faSave;
  faShirt = faShirt;
  faCircleCheck = faCircleCheck;
  faTags = faTags;
  faIdBadge = faIdBadge;
  faEnvelope = faEnvelope;
  faPhone = faPhone;

  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.user);
  }



  update() {

    console.log('form enviado');

    this.disabledButton = true;
    this.loadingIcon = true;

    // this._user.updateStore(this.form.value).subscribe({
    //   next: (resp: any) => {
    //     Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
    //     this.disabledButton = false;
    //     this.loadingIcon = false;
    //     this.success = true;
    //   },
    //   error: (error: any) => {
    //     Swal.fire(
    //       'Error',
    //       'Ocurrió un problema al actualizar. Inténtalo nuevamente.',
    //       'error'
    //     );
    //     console.error(error);
    //   },
    // });
  }

}
