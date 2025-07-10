/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
// import { addAppIconsToLibrary } from '../src/app/core/icons/font-awesome.icon'; //Estos son los iconos personalizados de font-awesome (addAppIconsToLibrary es una funcion que hemos creado)

// addAppIconsToLibrary(); //llama a los iconos personalizados de font-awesome

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

