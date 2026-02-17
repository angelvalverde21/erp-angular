import { Component, Input, OnInit } from '@angular/core';
import { round } from 'lodash-es';

@Component({
  selector: 'app-widget-cost',
  imports: [],
  templateUrl: './widget-cost.component.html',
  styleUrl: './widget-cost.component.scss'
})
export class WidgetCostComponent implements OnInit{

  ngOnInit(): void {
    this.total_cost = Math.round(Number(this.total_cost) * 100 ) / 100; // Redondear a 2 decimales
  }

  @Input() total_cost: number = 0;



}
