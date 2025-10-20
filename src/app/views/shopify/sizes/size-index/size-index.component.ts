import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Size } from '../../../../interfaces/size.interface';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { SizeService } from '../size.service';
import { SizeRowComponent } from '../size-row/size-row.component';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-size-index',
  imports: [SizeRowComponent, CdkDropList, CdkDrag],
  templateUrl: './size-index.component.html',
  styleUrl: './size-index.component.scss'
})
export class SizeIndexComponent implements OnInit, OnDestroy {

  @Input() sizes: Size[] = [];

  constructor(private _size: SizeService) {

  }

  ngOnInit(): void {

  }

  destroy$ = new Subject<void>();
  loading: boolean = false;

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  reListSizes(id: any) {

    this.sizes = this.sizes.filter((size) => size.id !== id);

  }

  // drop(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(this.sizes, event.previousIndex, event.currentIndex);
  // }

  reOrderSizes(event: CdkDragDrop<string[]>) {

    if (event.previousIndex === event.currentIndex) {
      return; // No hubo cambio
    }

    const array = moveItemInArray(this.sizes, event.previousIndex, event.currentIndex);

    // console.log(event);
    console.log('Nuevo orden:', this.sizes);

    this._size.sort(0, this.sizes).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Se han ordenado correctamente', 'success');
        console.log(resp);
        this.sizes = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al ordenar', 'error');
        console.error(error);
      },

    });

  }

}
