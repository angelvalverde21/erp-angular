import { Component, Input, OnInit } from '@angular/core';
import { UploadDropzoneComponent } from '../../upload-dropzone/upload-dropzone.component';



@Component({
  selector: 'app-gallery',
  imports: [UploadDropzoneComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {

  @Input() path: string = "products/colors/store"; 
  


  constructor() {
    // Puedes inicializar cualquier lógica aquí si es necesario
  } 

  ngOnInit(): void {
    // Aquí puedes realizar cualquier inicialización adicional si es necesario
    
  }
  
}
