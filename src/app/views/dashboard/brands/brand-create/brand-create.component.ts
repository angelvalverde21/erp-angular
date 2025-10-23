import { Component, EventEmitter, Output } from '@angular/core';
import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import {
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { BrandService } from '../brand.service';
import { CreateFormService } from '../../../shared/services/crud/create-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brand-create',
  imports: [ButtonComponent, InputGroupComponent, ReactiveFormsModule],
  templateUrl: './brand-create.component.html',
  styleUrl: './brand-create.component.scss',
})
export class BrandCreateComponent {

  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  @Output() emitBrandCreate = new EventEmitter<any>();

  constructor(
    public formSrv: CreateFormService,
    private _brand: BrandService
  ) { }

  formEmitsubscription!: Subscription;

  ngOnInit() {

    this.formSrv.initForm({
      name: ['', [Validators.required]],
    });

    //Escuchamos al servicio createFormService para saber cuando se crea un nuevo registro
    this.formEmitsubscription = this.formSrv.create$.subscribe((data) => {
      console.log('Nuevo registro creado', data);
      this.emitBrandCreate.emit(data);
    });
  }

  create() {
    this.formSrv.create((data) => this._brand.store(data)); //pasamos la funcion anonima que llama al metodo "store" del servicio de BrandService
  }


  ngOnDestroy(): void {

    if (this.formEmitsubscription) {
      this.formEmitsubscription.unsubscribe();
    }

  }

}
