import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BarcodeService } from 'src/app/views/dashboard/barcodes/barcode.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-print-barcode',
  imports: [
    ButtonComponent
  ],
  templateUrl: './button-print-barcode.component.html',
  styleUrl: './button-print-barcode.component.scss'
})
export class ButtonPrintBarcodeComponent implements OnInit, OnDestroy {

  faBarcode = faBarcode;

  @Input() variants: any[] = [];

  constructor(
    private _barcode: BarcodeService
  ) {

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  loading: boolean = false;

  printBarcode() {

    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Generando etiquetas',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._barcode.print(this.variants).pipe(takeUntil(this.destroy$)).subscribe({

      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // 👇 Abre el PDF en otra pestaña sin exponer tu API
        window.open(url, '_blank');

        Swal.close();

        // Limpia la URL después de unos segundos
        setTimeout(() => window.URL.revokeObjectURL(url), 100000);

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al generar el PDF.', 'error');
        console.error(error);
        this.loading = false;
      },

    });



  }
  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }
}
