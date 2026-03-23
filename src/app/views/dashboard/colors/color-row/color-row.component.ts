import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { Color } from '../color.interface';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ColorService } from '../color.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { ButtonGalleryComponent } from '../../../shared/components/buttons/button-gallery/button-gallery.component';

@Component({
  selector: 'app-color-row',
  imports: [NgbAccordionModule, GalleryComponent, LoadingComponent, ButtonComponent, ButtonGalleryComponent],
  templateUrl: './color-row.component.html',
  styleUrl: './color-row.component.scss'
})
export class ColorRowComponent {

  @Input() item!: string;
  @Input() collapsed = true;
  @Input() color!: Color;

  @Output() emitColorId = new EventEmitter<Number>();
  
  faTrash = faTrash

  constructor(private _color: ColorService){
  
  }

  loading: boolean = false;
    
  delete(color: Color){

    this.loading = true;

    this._color.destroy(color.product_id, color.id).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        console.log(color.id);
        
        this.emitColorId.emit(color.id);
        Swal.fire('Elminado', 'El registro ha sido eliminadoxx', 'success');
      },
    
      error: (error: any) => {
        this.loading = false;
        console.error(error);
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}
