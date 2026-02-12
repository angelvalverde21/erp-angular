import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-kardex-index',
  imports: [
    JsonPipe,
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './kardex-index.component.html',
  styleUrl: './kardex-index.component.scss'
})
export class KardexIndexComponent implements OnInit{
 
  faBarcode = faBarcode;
  balance: number = 0;

  fallados: number = 0;
  reparados: number = 0
  saldo: number = 0

  @Input() kardexes: any[] = [];

  ngOnInit(): void {


    // Inicializar la lista de variantes de kardex
    this.balance = this.kardexes.reduce((acc, kardex) => acc + kardex.quantity * (kardex?.direction === 'in' ? 1 : -1), 0); //reduce, reduce el array a un numero;

    this.fallados = this.kardexes.reduce((acc, kardex) => acc + (kardex.comment === 'Fallado' ? kardex.quantity : 0), 0);

    this.reparados = this.kardexes.reduce((acc, kardex) => acc + (kardex.comment === 'Reparado' ? kardex.quantity : 0), 0);

    this.saldo = this.fallados - this.reparados;

  }

}
