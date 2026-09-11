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

  downloadPdf__(tipo: string, message: string = '') {
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

  downloadPdf(tipo: string, message: string = '') {
    // 1. Abrir pestaña de inmediato para evitar bloqueos del navegador
    const nuevaPestaña = window.open('', '_blank');
    if (nuevaPestaña) {
      nuevaPestaña.document.title = "Cargando PDF...";
      // Inyectamos HTML y CSS para un spinner elegante
      nuevaPestaña.document.body.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        font-family: sans-serif; 
        background-color: #f8f9fa;
        margin: 0;
      ">
        <div style="
          width: 50px; 
          height: 50px; 
          border: 5px solid #e9ecef; 
          border-top: 5px solid #3498db; 
          border-radius: 50%; 
          animation: spin 1s linear infinite;
        "></div>
        <h2 style="color: #495057; margin-top: 20px; font-size: 1.2rem;">Generando Ticket...</h2>
        
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
    }

    // 2. Mostrar el Loading de SweetAlert en la pantalla principal
    Swal.fire({
      title: 'Espere...',
      html: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // 3. Ejecutar la petición directamente (FUERA de didOpen)
    this.pdfService.downloadVoucher(this.order_id).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);

        // Asignar el PDF a la pestaña que ya tenemos abierta con el spinner
        if (nuevaPestaña && !nuevaPestaña.closed) {
          nuevaPestaña.location.href = url;
        } else {
          window.open(url, '_blank');
        }

        Swal.close();
      },
      error: (error) => {
        // Si el servidor falla, cerramos la pestaña con el spinner
        if (nuevaPestaña) nuevaPestaña.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el archivo. Por favor, intente nuevamente.',
          confirmButtonText: 'Aceptar',
        });
        console.error('Error al descargar el PDF', error);
      },
    });
  }

}
