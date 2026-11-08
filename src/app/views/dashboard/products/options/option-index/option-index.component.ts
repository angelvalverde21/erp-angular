import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { firstValueFrom, Subject, takeUntil, timeout, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { OptionRemoval, OptionService } from '../option.service';
import { OptionValueDeletion } from '../OptionValues/option_value.service';
import { OptionCreateComponent } from '../option-create/option-create.component';
import { OptionValueIndexComponent } from '../OptionValues/option-value-index/option-value-index.component';
@Component({
  selector: 'app-option-index',
  imports: [
    OptionCreateComponent,
    OptionValueIndexComponent

  ],
  templateUrl: './option-index.component.html',
  styleUrl: './option-index.component.scss'
})
export class OptionIndexComponent implements OnInit, OnDestroy {

  constructor(private optionService: OptionService) {}
  private destroy$ = new Subject<void>();
  removingOptionId: number | null = null;
  removing = false;
  removalError = '';

  @Input() options_init: any;
  @Input() product_id: number = 0;
  @Input() options: any;
  @Output() valueDeleted = new EventEmitter<OptionValueDeletion>();
  @Output() blockRemoved = new EventEmitter<OptionRemoval>();

  options_complete: boolean = false;

  get orderedOptions(): any[] {
    return [...(this.options || [])].sort((a, b) => Number(b.name === 'color') - Number(a.name === 'color'));
  }

  ngOnInit(): void {

    this.options.forEach((option:any) => {
      this.removeOptionInit(option);
    });

  }

  receiveOption(option: any) {
    this.options = [...this.options, option];
    this.removeOptionInit(option);
  }

  removeOptionInit(option: any) {
    this.options_init = this.options_init.filter((o: any) => o.name !== option.name);
  }

  checkOptionsComplete(){

  }

  async removeOption(option: any): Promise<void> {
    if (this.removingOptionId !== null) return;
    this.removingOptionId = option.id;
    this.removalError = '';
    try {
      const confirmation = await Swal.fire({
        title: 'Quitar opción',
        text: `Vas a quitar "${option.label || option.name}". Si contiene valores o tiene datos de inventario o ventas, se archivará junto con sus variantes, conservando el stock, las ventas y el historial. Las variantes archivadas dejarán de estar activas. Solo se eliminará si está vacía y sin datos asociados.`,
        icon: 'warning', showCancelButton: true, focusCancel: true,
        confirmButtonText: 'Quitar opción', cancelButtonText: 'Cancelar',
      });
      if (!confirmation.isConfirmed) return;
      this.removing = true;
      const response = await firstValueFrom(this.optionService.destroy(option.id, this.product_id).pipe(
        timeout({ first: 20000 }), takeUntil(this.destroy$),
      ));
      this.options = this.options.filter((item: any) => item.id !== option.id);
      if (!this.options_init.some((item: any) => item.name === option.name)) {
        this.options_init = [{ name: option.name, label: option.label || option.name }, ...this.options_init];
      }
      this.blockRemoved.emit(response.data);
    } catch (error: any) {
      this.removalError = error instanceof TimeoutError
        ? 'El servidor tardó demasiado. Actualiza el producto para comprobar el estado de la opción.'
        : error.error?.errors ? Object.values(error.error.errors).flat().join(' ')
        : 'No se pudo quitar la opción. Intenta nuevamente.';
    } finally {
      this.removing = false;
      this.removingOptionId = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.removingOptionId !== null && !this.removing) Swal.close();
  }

}
