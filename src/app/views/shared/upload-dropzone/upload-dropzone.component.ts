import { Component, EventEmitter, Input, Output } from '@angular/core';
import Dropzone from 'dropzone';
import { AuthService } from '../../../core/auth/auth.service';

// import { AuthService } from '@core/auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { environment } from '../../../core/environments/environment';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-upload-dropzone',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './upload-dropzone.component.html',
  styleUrl: './upload-dropzone.component.css',
})
export class UploadDropzoneComponent {
  store: string = '';
  url: string = '';
  dropzoneId: string = '';
  image: string = '';
  name: string = '';

  @Output() fileUpload = new EventEmitter<any>();
  @Output() lastFileUpload = new EventEmitter<any>();
  @Output() errorUpload = new EventEmitter<boolean>();

  @Input() parallelUploads: number = 4;
  @Input() path: string = '';
  @Input() title: string = '';
  @Input() dir: string = 'products/colors';
  @Input() usage: string = 'colors';
  @Input() bordeColor: string = '#CCC';

  faCamera = faCamera;

  // dropzoneStyle = {
  //   border: `2px dashed ${this.bordeColor}`,
  //   // backgroundColor: `${this.bordeColor}`,
  //   // otros estilos si necesitas
  // };

  constructor(
    private _auth: AuthService, // private upperFirstPipe: UpperFirstPipe
    private _store: StoreService
  ) {
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
    console.log(this.bordeColor);

    this.dropzoneId = `dropzone-${this.toKebabCase(this.title)}-${Math.floor(
      Math.random() * 1000
    )}`;
    this.url =
      environment.apiDashboard + '/' + this._store.name() + `/` + this.path; // Actualiza esto con la URL de tu servidor
    console.log(this.url);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      //usamos setTimeOut solo para retrazar ligeramente el tiempo de carga, asi esperamos que el contenedor padre cargue primero, en este caso cuando este componente es llamado desde <app-card-config>
      const self = this; // Guardamos una referencia al componente
      // Dropzone.autoDiscover = false; // Desactivar la auto-detección de Dropzone
      // console.log(localStorage.getItem('access_token'));

      const dropzone = new Dropzone(`#${this.dropzoneId}`, {
        url: this.url,
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`, // Agrega el token de autenticación en los headers
        },
        // dictDefaultMessage: `<div>Sube tus archivos aquí</div> <i class="fas fa-camera" style="font-size: 18pt;"></i>`,
        dictDefaultMessage: `<div class="mb-2">${this.title}</div>
                            <div style="background: #FFF; padding: 5px; border-radius: 5px; border: 1px dashed #ccc; opacity: 0.5;">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
                              <path d="M149.1 64.5c6.5-11.2 18.5-18.5 31.6-18.5h150.7c13.1 0 25.1 7 31.6 18.5l14.5 25.5H464c26.5 0 48 21.5 48 48v256c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V138c0-26.5 21.5-48 48-48h86.5l14.6-25.5zM256 400c79.5 0 144-64.5 144-144S335.5 112 256 112 112 176.5 112 256s64.5 144 144 144zm0-48a96 96 0 1 1 0-192 96 96 0 1 1 0 192z"/>
                              </svg>
                            </div>`,
        acceptedFiles: 'image/*',
        // paramName: 'file',
        maxFilesize: 10, // Tamaño máximo en MB
        parallelUploads: 4, // Enviar 4 archivos a la vez
        init: function () {
          this.on('success', function (file: any, resp: any) {
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

          this.on('error', (resp: any) => {
            console.error('Error al subir el archivo:', resp);
            self.errorUpload.emit(true);
          });

          this.on('complete', (file: any) => {
            this.removeFile(file);
          });

          this.on('queuecomplete', (resp: any) => {
            // Aquí disparas la alerta
            self.lastFileUpload.emit(self.image);
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

    this._store.name() = this._store.leerSlugBase()!;
    const self = this; // Guardamos una referencia al componente
    this.url =  environment.apiUrl + '/procesos/options/' + this._store.name() + '/upload', // Actualiza esto con la URL de tu servidor
      
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
