import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ManufactureEditComponent } from '../manufacture-edit/manufacture-edit.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { ManufactureService } from '../manufacture.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '../../purchases/purchase-index/purchase-index.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseCreateComponent } from '../../purchases/purchase-create/purchase-create.component';

@Component({
  selector: 'app-manufacture-edit-page',
  imports: [
    ManufactureEditComponent,
    LoadingComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    PurchaseIndexComponent,
    PurchaseCreateComponent
  ],
  templateUrl: './manufacture-edit-page.component.html',
  styleUrl: './manufacture-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ManufactureEditPageComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;
  purchases: any;

  modal: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _manufacture: ManufactureService,
    private route: ActivatedRoute,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.subscribe(params => {
      this.manufacture_id = params['manufacture_id'];
    });

  }
  ngOnInit(): void {
    this.manufactureInit();
  }

  manufactureInit() {

    this.loading = true;

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.manufacture = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema guardar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  closeModal() {
    this.modal.close();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

}


