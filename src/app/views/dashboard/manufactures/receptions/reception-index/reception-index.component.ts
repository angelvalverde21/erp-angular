import { Component, Input } from '@angular/core';
import { ReceptionIndexRowComponent } from '../reception-index-row/reception-index-row.component';
import { BaseService } from 'src/app/views/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reception-index',
  imports: [
    ReceptionIndexRowComponent
  ],
  templateUrl: './reception-index.component.html',
  styleUrl: './reception-index.component.scss'
})
export class ReceptionIndexComponent {

  @Input() manufactures: any;

  constructor(
    private _base: BaseService,
    private router: Router

  ){
  
  }

  link: any;

  getManufactureReceptionId(manufacture: any) {
    if (manufacture.type == 'order') {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'orders', manufacture.id, 'receptions'];
    } else {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'productions', manufacture.id, 'receptions'];
    }

    return this.router.navigate(this.link);

  }


}
