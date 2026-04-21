import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ButtonBackComponent } from 'src/app/views/shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { InventoryIndexComponent } from '../inventory-index/inventory-index.component';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../inventory.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { InventoryCreateComponent } from '../inventory-create/inventory-create.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventory-index-page',
  imports: [
    HeadPageComponent,
    ButtonBackComponent,
    InventoryIndexComponent,
    ButtonAddComponent,
    LoadingComponent,
    InventoryCreateComponent
  ],
  templateUrl: './inventory-index-page.component.html',
  styleUrl: './inventory-index-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InventoryIndexPageComponent implements OnInit, OnDestroy {

  constructor(
    private _inventory: InventoryService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  loading: boolean = false;

  ngOnInit(): void {
    this.inventoriesIncomeInit();
  }

  inventoriesIncomeInit() {

    this.loading = true;

    this._inventory.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);

        
        this.inventories = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  inventories: any;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }
  closeModal() {
    this.modal.close();
  }

  modal: any;
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

  receiveInventoryCreate($event: any) {

    this.router.navigate(['./', $event.id], { relativeTo: this.route })
    .then(() => {
    
      console.log('Nueva URL:', this.router.url);
    
    });

    this.modal.close();
  }
}

