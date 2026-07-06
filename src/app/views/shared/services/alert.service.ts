import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(
    text: string = 'Operación realizada correctamente',
    title: string = 'Correcto'
  ) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  error(
    text: string = 'Ocurrió un error',
    title: string = 'Error'
  ) {
    return Swal.fire({
      icon: 'error',
      title,
      text
    });
  }

  warning(text: string, title: string = 'Advertencia') {
    return Swal.fire({
      icon: 'warning',
      title,
      text
    });
  }

  info(text: string, title: string = 'Información') {
    return Swal.fire({
      icon: 'info',
      title,
      text
    });
  }

  confirm(
    text: string,
    title: string = '¿Estás seguro?'
  ) {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    });
  }
}