import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ShopifyOrderService } from '../../../../dashboard/shopify/orders/shopify.order.service';
import { ManufactureVariantService } from '../../../../dashboard/manufactures/manufacture.variants.service';
import { ManufactureService } from '../../../../dashboard/manufactures/manufacture.service';
import { ButtonComponent } from '../button/button.component';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-print',
  standalone: true,
  imports: [NgbDropdownModule, ButtonComponent],
  templateUrl: './button-print.component.html',
  styleUrl: './button-print.component.scss'
})
export class ButtonPrintComponent {

  @Input() manufacture_id: number = 0;

  faPrint = faPrint;
  constructor(private _manufacture: ManufactureService) {

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
    this._manufacture.pdf(this.manufacture_id).subscribe({
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
