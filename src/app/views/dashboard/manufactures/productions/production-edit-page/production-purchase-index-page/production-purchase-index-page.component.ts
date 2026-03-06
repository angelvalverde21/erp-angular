import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ManufactureProductionService } from '../../production.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from 'src/app/views/dashboard/purchases/purchase-index/purchase-index.component';
import { ProductionEditHeadComponent } from '../production-edit-head/production-edit-head.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-production-purchase-index-page',
  imports: [
    PurchaseIndexComponent,
    ProductionEditHeadComponent,
    LoadingComponent
  ],
  templateUrl: './production-purchase-index-page.component.html',
  styleUrl: './production-purchase-index-page.component.scss'
})
export class ProductionPurchaseIndexPageComponent implements OnInit, OnDestroy {



}
