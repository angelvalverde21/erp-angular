import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MercadoPagoService } from '../mercadopago.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mp-transaction-index-page',
  imports: [
    JsonPipe,
    LoadingComponent,
    CommonModule,
    NgbAccordionModule
  ],
  templateUrl: './mp-transaction-index-page.component.html',
  styleUrl: './mp-transaction-index-page.component.scss'
})
export class MpTransactionIndexPageComponent {

  constructor(private _mercadoPago: MercadoPagoService) {

  }

  transactions: any;

  loading: boolean = false;

  getTransactions() {

    this.loading = true;

    this._mercadoPago.transactions().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.transactions = resp.original.results;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al consultar los movimientos', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.getTransactions();
  }


  getStatusDetailText(status: string, statusDetail?: string): string {
    const mensajes: Record<string, string> = {
      // ✅ Estados generales
      'accredited': 'Pago aprobado',
      'authorized': 'Pago autorizado',
      'in_process': 'Pago en revisión',
      'pending': 'Pago pendiente',
      'pending_waiting_payment': 'Esperando el pago',
      'pending_contingency': 'Procesando pago',
      'cancelled': 'Pago cancelado',
      'refunded': 'Pago reembolsado',
      'charged_back': 'Pago con contracargo',
      'rejected': 'Pago rechazado',

      // 🧾 Errores del comprador (datos mal ingresados)
      'cc_rejected_bad_filled_card_number': 'Número incorrecto',
      'cc_rejected_bad_filled_date': 'Fecha incorrecta',
      'cc_rejected_bad_filled_other': 'Datos incorrectos',
      'cc_rejected_bad_filled_security_code': 'CVV incorrecto',

      // 🏦 Rechazos del banco
      'cc_rejected_call_for_authorize': 'Autoriza con tu banco',
      'cc_rejected_card_disabled': 'Tarjeta deshabilitada',
      'cc_rejected_duplicated_payment': 'Pago duplicado',
      'cc_rejected_insufficient_amount': 'Fondos insuficientes',
      'cc_rejected_max_attempts': 'Demasiados intentos fallidos',
      'cc_rejected_high_risk': 'Riesgo detectado',
      'cc_rejected_blacklist': 'Pago bloqueado',
      'cc_rejected_other_reason': 'Rechazo del banco',

      // 💳 Otros posibles estados
      'rejected_other_reason': 'Pago rechazado',
      'pending_review_manual': 'En revisión manual',
      'pending_waiting_for_funds': 'Esperando fondos',
      'refunded_partially': 'Pago parcialmente reembolsado',
      'money_release_pending': 'Dinero en retención',
      'money_release_released': 'Dinero liberado',
    };

    // Prioridad: si existe status_detail, úsalo, si no, usa status
    return mensajes[statusDetail || status] || 'Estado desconocido';
  }


  getColorAlertStatus(status: string) {
    switch (status) {
      case 'accredited':
        return "alert alert-success";
        break;
      case 'authorized':
        return "alert alert-success";
        break;
      case 'rejected':
        return "alert alert-danger";
        break;
      case 'rejected':
        return "alert alert-danger";
        break;
      case 'cc_rejected_bad_filled_security_code':
        return "alert alert-danger";
        break;

      default:
        return "alert alert-warning";
        break;
    }
  }

}
