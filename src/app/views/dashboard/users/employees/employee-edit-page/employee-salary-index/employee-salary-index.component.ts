import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-salary-index',
  imports: [
    CommonModule
  ],
  templateUrl: './employee-salary-index.component.html',
  styleUrl: './employee-salary-index.component.scss'
})
export class EmployeeSalaryIndexComponent implements OnInit, OnDestroy {


  employee: any;

  constructor(
    private _employee: EmployeeService,
  ) {

    effect(() => {

      const event = this._employee.receiveSignal();

      // console.log(event);
      if (!event) return;

      this.employee = event;
      // console.log(this.employee);

    });

  }

  ngOnInit(): void {


  }

  ngOnDestroy(): void {

  }




}
