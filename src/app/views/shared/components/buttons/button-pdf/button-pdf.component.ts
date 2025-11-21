import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ShopifyOrderService } from '../../../../dashboard/shopify/orders/shopify.order.service';

@Component({
  selector: 'app-button-pdf',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './button-pdf.component.html',
  styleUrl: './button-pdf.component.css',
})
export class ButtonPdfComponent {

  @Input() order_id: number = 0;

  constructor(private pdfService: ShopifyOrderService) {

  }

  downloadPdf_(tipo: string, message: string = '') {

    console.log(this.order_id);
    

    Swal.fire({
      title: 'Espere...',
      html: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.pdfService.downloadVoucher(this.order_id).subscribe({
          next: (response: Blob) => {
            const timestampInSeconds = Math.floor(Date.now() / 1000);

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download =
              this.order_id + '-' + timestampInSeconds + '-' + tipo + '.pdf'; // Nombre por defecto para el archivo descargado
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // Limpia la URL creada

            Swal.close();
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Correcto',
            //   text: 'Hemos generado su pdf',
            //   confirmButtonText: 'OK',
            //   showConfirmButton: true,
            //   timer: 1000,  // 1000 milisegundos = 1 segundo
            //   timerProgressBar: true
            // })
          },

          error: (error) => {

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo descargar el archivo. Por favor, intente nuevamente',
              confirmButtonText: 'Aceptar',
            });

            console.error('Error al descargar el PDF', error);
          },
        });
      },
    });
  }

  downloadPdf(tipo: string, message: string = '') {
  Swal.fire({
    title: 'Espere...',
    html: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      this.pdfService.downloadVoucher(this.order_id).subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // 👇 Abre el PDF en otra pestaña sin exponer tu API
          window.open(url, '_blank');

          Swal.close();

          // Limpia la URL después de unos segundos
          setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        },

        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo abrir el archivo. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar',
          });
          console.error('Error al descargar el PDF', error);
        },
      });
    },
  });
}
}
