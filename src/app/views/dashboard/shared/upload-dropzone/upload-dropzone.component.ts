import { Component, EventEmitter, Input, Output } from '@angular/core';
import Dropzone from 'dropzone';
import { AuthService } from 'src/app/core/auth/auth.service';
import { environment } from 'src/app/core/environments/environment';

// import { AuthService } from '@core/auth/auth.service';


@Component({
  selector: 'app-upload-dropzone',
  imports: [],
  templateUrl: './upload-dropzone.component.html',
  styleUrl: './upload-dropzone.component.css',
})
export class UploadDropzoneComponent {

  store: string = "";
  url: string = "";
  dropzoneId: string = "";
  image: string = "";
  name: string = "";
  
  @Output() fileUpload = new EventEmitter<any>();
  @Output() fileTotalUpload = new EventEmitter<boolean>();
  @Output() errorUpload = new EventEmitter<boolean>();


  @Input() parallelUploads: number = 4;
  @Input() path: string = "";
  @Input() title: string = "Agregar Imagenes";
  @Input() dir: string = "products/colors";
  @Input() usage: string = "colors";
  
  constructor(
    private _auth : AuthService,

    // private upperFirstPipe: UpperFirstPipe
  ){
    this.name = this.toPascalCase(this.title);
  }

  toPascalCase(str: string): string {
    return str
      .replace(/[_-]/g, ' ') // Reemplaza guiones y guiones bajos por espacios
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // Capitaliza cada palabra después de un espacio
      .replace(/^./, (char) => char.toUpperCase()); // Capitaliza la primera letra
  }

  toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Inserta guion medio entre minúsculas y mayúsculas
      .replace(/\s+/g, '-') // Reemplaza espacios por guion medio
      .toLowerCase(); // Convierte todo a minúsculas
  }

  ngOnInit(): void {

    this.dropzoneId = `dropzone-${this.toKebabCase(this.title)}-${Math.floor(Math.random() * 1000)}`;
    this.url =  environment.apiPrivate + '/' + environment.storeName + `/` + this.path; // Actualiza esto con la URL de tu servidor
    console.log(this.url);
  }
  
  ngAfterViewInit(): void { 
    
    setTimeout(() => { //usamos setTimeOut solo para retrazar ligeramente el tiempo de carga, asi esperamos que el contenedor padre cargue primero, en este caso cuando este componente es llamado desde <app-card-config>
    const self = this; // Guardamos una referencia al componente
    // Dropzone.autoDiscover = false; // Desactivar la auto-detección de Dropzone
    // console.log(localStorage.getItem('access_token'));

    
    const dropzone = new Dropzone(`#${this.dropzoneId}`, {
      url: this.url,
      headers: {
        'Authorization': `Bearer ${this._auth.getToken()}`, // Agrega el token de autenticación en los headers
      },
      // dictDefaultMessage: `<div>Sube tus archivos aquí</div> <i class="fas fa-camera" style="font-size: 18pt;"></i>`,
      dictDefaultMessage: `<div class="mb-2">${this.title}</div><i class="fas fa-camera" style="font-size: 18pt;"></i>`,
      acceptedFiles: 'image/*',
      // paramName: 'file',
      maxFilesize: 10, // Tamaño máximo en MB
      parallelUploads: 4, // Enviar 4 archivos a la vez
      init: function () {

        this.on('success', function(file:any, resp:any) {
          // Manejar la respuesta JSON aquí
          console.log('Respuesta del servidor:', resp);

          if (resp.success) {
            
            // Puedes mostrar un mensaje, actualizar la UI, etc.
            console.log('Archivo subido correctamente:', resp);
            self.image = resp.data;
            // self._upload.ready(self.image);
            self.fileUpload.emit(self.image);

          } else {

            console.error('Error al subir el archivo:', resp.message);

          }
        });

        this.on('sending', (file, xhr, formData: any) => {
          // Agregar parámetros adicionales de forma dinámica
          formData.append('name', self.name); // Agrega el parámetro 'name'
          formData.append('dir', self.dir); // Agrega el parámetro 'dir'
          formData.append('usage', self.usage); // Agrega el parámetro 'usage'
        });

        this.on('error', (resp:any) => {
          console.error('Error al subir el archivo:', resp);
          self.errorUpload.emit(true);
        });
        
        this.on('complete', (file:any) => {
          this.removeFile(file);
        });
        
        this.on('queuecomplete', function() {
          // Aquí disparas la alerta
          self.fileTotalUpload.emit(true);
          // alert('¡Todas las fotos han sido subidas exitosamente!');
        });
      },
    });

  }, 0);

  }

  /* 
  -
  - clase anterior (para options) 
  -

  store: string = "";
  url: string = "";
  imageOption: string = "";

  @Input() name: string = "logo"; 
  
  constructor(
    private _store : StoreService
  ){

  }

  ngOnInit(): void {

    environment.storeName = this._store.leerSlugBase()!;
    const self = this; // Guardamos una referencia al componente
    this.url =  environment.apiUrl + '/procesos/options/' + environment.storeName + '/upload', // Actualiza esto con la URL de tu servidor
      
    Dropzone.autoDiscover = false; // Desactivar la auto-detección de Dropzone

    const dropzone = new Dropzone('#my-dropzone', {
      url: this.url,
      headers: {
        'X-CSRF-TOKEN': 'tu-csrf-token', // Actualiza esto según corresponda
      },
      dictDefaultMessage: `<div>Sube tus archivos aquí</div> <i class="fas fa-camera" style="font-size: 18pt;"></i>`,
      acceptedFiles: 'image/*',
      // paramName: 'file',
      maxFilesize: 10, // Tamaño máximo en MB
      init: function () {

        this.on('success', function(file, resp:any) {
          // Manejar la respuesta JSON aquí
          console.log('Respuesta del servidor:', resp);

          if (resp.success) {
            // Puedes mostrar un mensaje, actualizar la UI, etc.
            console.log('Archivo subido correctamente:', resp.image);
            self.imageOption = resp.image;
            
          } else {
            console.error('Error al subir el archivo:', resp.message);
          }
        });

        this.on('sending', (file, xhr, formData) => {
          // Agregar parámetros adicionales de forma dinámica
          formData.append('name', self.name); // Agregar el parámetro 'name'
        });
        
        this.on('complete', (file) => {
          this.removeFile(file);
        });

      },
    });
  }

  */

}
