import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe, PercentPipe } from '@angular/common';
import { faPen, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ButtonEditComponent } from '@buttons/button-edit/button-edit.component';

@Component({
  selector: 'app-employee-index',
  imports: [
    DateShopifyPipe,
    JsonPipe,
    ButtonEditComponent,
    PercentPipe

  ],
  templateUrl: './employee-index.component.html',
  styleUrl: './employee-index.component.scss'
})
export class EmployeeIndexComponent {

  @Input() employees: any[] = [];

  faPen = faEllipsis;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  getEmployeeId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
