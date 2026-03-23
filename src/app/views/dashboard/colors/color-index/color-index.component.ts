import { Component, Input } from '@angular/core';
import { ColorRowComponent } from '../color-row/color-row.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { Color } from '../color.interface';
import { JsonPipe } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { ColorService } from '../color.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-color-index',
  imports: [
    ColorRowComponent,
    ButtonComponent,
    JsonPipe,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './color-index.component.html',
  styleUrl: './color-index.component.scss'
})
export class ColorIndexComponent {
  items = ['First', 'Second', 'Third'];

  @Input() colors: Color[] = [];

  ngOnInit(): void {

  }

  constructor(private _color: ColorService) {

  }

  destroy$ = new Subject<void>();
  loading: boolean = false;

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  reListColors(id: any) {

    console.log("color eliminado : " + id);
    
    this.colors = this.colors.filter((color) => color.id !== id);

  }

  // drop(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(this.colors, event.previousIndex, event.currentIndex);
  // }

  reOrderColors(event: CdkDragDrop<string[]>) {

    if (event.previousIndex === event.currentIndex) {
      return; // No hubo cambio
    }

    const array = moveItemInArray(this.colors, event.previousIndex, event.currentIndex);

    // console.log(event);
    console.log('Nuevo orden:', this.colors);

    this._color.sort(0, this.colors).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Se han ordenado correctamente', 'success');
        console.log(resp);
        this.colors = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al ordenar', 'error');
        console.error(error);
      },

    });

  }


}
