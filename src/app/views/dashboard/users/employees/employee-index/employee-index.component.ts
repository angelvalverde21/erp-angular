import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-employee-index',
  imports: [
    DateShopifyPipe,
    JsonPipe,

  ],
  templateUrl: './employee-index.component.html',
  styleUrl: './employee-index.component.scss'
})
export class EmployeeIndexComponent {

  @Input() employees: any[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  getEmployeeId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
