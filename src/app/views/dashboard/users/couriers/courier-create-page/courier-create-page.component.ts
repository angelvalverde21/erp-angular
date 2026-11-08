import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourierCreateComponent } from '../courier-create/courier-create.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '../../../../shared/components/head-page/head-page.component';
import { Courier } from '../courier.model';

@Component({
  selector: 'app-courier-create-page',
  imports: [CourierCreateComponent, ButtonBackComponent, HeadPageComponent],
  templateUrl: './courier-create-page.component.html',
  styleUrl: './courier-create-page.component.scss'
})
export class CourierCreatePageComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  receiveCourierCreate(courier: Courier): void {
    this.router.navigate(['../', courier.id], { relativeTo: this.route });
  }
}