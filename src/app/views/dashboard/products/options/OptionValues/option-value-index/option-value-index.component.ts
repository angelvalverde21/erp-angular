import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OptionValueCreateComponent } from '../option-value-create/option-value-create.component';
import Swal from 'sweetalert2';
import { firstValueFrom, Subject, takeUntil, timeout, TimeoutError } from 'rxjs';
import { OptionValueDeletion, OptionValueService } from '../option_value.service';
// import { GalleryComponent } from '../../../../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-option-value-index',
  imports: [
    OptionValueCreateComponent,
    // GalleryComponent
  ],
  templateUrl: './option-value-index.component.html',
  styleUrl: './option-value-index.component.scss'
})

export class OptionValueIndexComponent implements OnInit, OnDestroy {

  constructor(private optionValueService: OptionValueService) {}
  private destroy$ = new Subject<void>();
  @Input() product_id = 0;
  @Output() valueDeleted = new EventEmitter<OptionValueDeletion>();
  @Output() removeBlock = new EventEmitter<void>();
  deletionError = '';
  deletingId: number | null = null;

  @Input() option_values: any[] = [];
  @Input() option_id: number = 0;
  @Input() name: string = "";
  @Input() label: string = "";

  // @Input() options: any[] = [];
  @Input() create: boolean = true;
  @Input() option_selected = "";

  // option_values: any[] = [];

  ngOnInit(): void {

    // this.option_values = this.options.flatMap(option => option.values);

    // if (this.option_selected != "") {
    //   this.options = this.options.filter((o:any) => o.name === this.option_selected);
    // }
  }

  receiveOptionValue(new_option_value: any) {

    console.log("recibiendo el valor del new_option_value");

    console.log(new_option_value);
    const option = {
      ...new_option_value.option, //aqui armamos primero la opcion (option)
      values: new_option_value //y luego su valor (option->option_value)
    }

    console.log(option);
    this.option_values = [...(this.option_values ?? []), new_option_value];

    // this.options = this.options.map(option => {

    //   if (option.id === new_option_value.option.id) {
    //     // console.log(option.name);
    //     option.option_values = [
    //       ...option.option_values,
    //       new_option_value
    //     ]
    //   }

    //   return option;

    // });

    // console.log(this.options);

  }

  confirmingDelete = false;

  async removeOptionValue(option_value_id: number): Promise<void> {
    if (this.confirmingDelete) return;
    const value = this.option_values.find(item => item.id === option_value_id);
    if (!value) return;
    this.confirmingDelete = true;
    this.deletionError = '';
    try {
      const result = await Swal.fire({
        title: 'Eliminar valor',
        text: `Se eliminará "${value.value}" de ${this.label || this.name || 'esta opción'} y sus variantes asociadas. La operación se bloqueará si tienen stock o historial.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        focusCancel: true,
      });
      if (result.isConfirmed) {
        this.deletingId = option_value_id;
        const response = await firstValueFrom(this.optionValueService.destroy(this.product_id, this.option_id, option_value_id).pipe(
          timeout({ first: 20000 }),
          takeUntil(this.destroy$),
        ));
        this.option_values = this.option_values.filter(item => item.id !== option_value_id);
        this.valueDeleted.emit(response.data);
      }
    } catch (error: any) {
      this.deletionError = error instanceof TimeoutError
        ? 'El servidor tardó demasiado en responder. Actualiza el producto para comprobar si el valor se eliminó antes de volver a intentarlo.'
        : error.error?.errors
        ? Object.values(error.error.errors).flat().join(' ')
        : 'No se pudo eliminar el valor. Intenta nuevamente.';
    } finally {
      this.confirmingDelete = false;
      this.deletingId = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.confirmingDelete && this.deletingId === null) Swal.close();
  }

}
