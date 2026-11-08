import { Component, Input } from '@angular/core';
import { OrderProgressStatus } from './order-status.model';

@Component({
  selector: 'app-order-status-stepper',
  templateUrl: './order-status-stepper.component.html',
  styleUrl: './order-status-stepper.component.scss',
})
export class OrderStatusStepperComponent {
  @Input() status: OrderProgressStatus = 'registrado';
  @Input() cancelled = false;
  @Input() onHold = false;

  get progressLabel(): string {
    if (this.cancelled) return 'Pedido cancelado';
    if (this.onHold) return 'En espera';
    return this.steps[this.currentStep]?.label ?? 'Sin información del estado';
  }

  readonly steps = [
    { status: 'registrado', label: 'Registrado', description: 'Pedido creado', icon: 'fa-receipt' },
    { status: 'pago_recibido', label: 'Pago recibido', description: 'Por confirmar', icon: 'fa-money-bill-transfer' },
    { status: 'pago_confirmado', label: 'Pago confirmado', description: 'Pago validado', icon: 'fa-circle-check' },
    { status: 'preparacion', label: 'En preparación', description: 'Preparando productos', icon: 'fa-box-open' },
    { status: 'enviado', label: 'Enviado', description: 'Pedido despachado', icon: 'fa-truck-fast' },
  ] as const;

  get currentStep(): number {
    if (this.cancelled || this.onHold) return -1;
    return this.steps.findIndex(step => step.status === this.status);
  }
}
