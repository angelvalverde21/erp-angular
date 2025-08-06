import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule, JsonPipe } from '@angular/common';
import { ButtonLinkComponent } from '../../components/buttons/button-link/button-link.component';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ButtonComponent } from '../../components/buttons/button/button.component';
import { environment } from '../../../../../core/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-list-template',
  imports: [
    FontAwesomeModule,
    CommonModule,
    ButtonComponent,
    ButtonLinkComponent
  ],
  templateUrl: './product-list-template.component.html',
  styleUrl: './product-list-template.component.scss',
})
export class ProductListTemplateComponent {
  faEdit = faEdit;
  faTrash = faTrash;

  @Input() products: any[] = [];

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src =
      environment.imageThumbnailPlaceHolderVertical;
  }

  archivar(product_id: number){

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Acción para eliminar el elemento

        

        Swal.fire(
          'Eliminado!',
          'El elemento ha sido eliminado.',
          'success'
        );
      }
    });
    
  }
}
