import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

// fuentes
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
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import Swal from 'sweetalert2';
import { SettingService } from '../setting.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { WarehouseIndexComponent } from '../../warehouses/warehouse-index/warehouse-index.component';
// fin de fuentes

@Component({
  selector: 'app-setting-page',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    InputGroupComponent,
    LoadingComponent,
    CommonModule,
    WarehouseIndexComponent
  ],
  templateUrl: './setting-page.component.html',
  styleUrl: './setting-page.component.scss',
})
export class SettingPageComponent implements OnInit {
  settingSubscription!: Subscription;


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
  

  store: any;
  colorTemplate: string = "primary";

  constructor(private fb: FormBuilder, private _setting: SettingService) {}

  
  success: boolean = false;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  loading: boolean = true;

  ngOnInit(): void {

    this.formInit();

    this.settingSubscription = this._setting.getStore().subscribe((resp: any) => {

        console.log(resp.data);
        this.form.patchValue(resp.data);
        this.store = resp.data;
        this.loading = false;
      });

  }

  form!: FormGroup;

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      ruc: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      slug: ['', [Validators.required]],
    });
  }


  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;

    this._setting.updateStore(this.form.value).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        this.success = true;
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al actualizar. Inténtalo nuevamente.',
          'error'
        );
        console.error(error);
      },
    });
  }
}
