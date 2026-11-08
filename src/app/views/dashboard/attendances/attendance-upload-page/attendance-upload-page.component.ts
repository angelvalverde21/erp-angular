import { Component } from '@angular/core';
import { AttendanceIndexPageComponent } from '../attendance-index-page/attendance-index-page.component';

@Component({
  selector: 'app-attendance-upload-page',
  imports: [AttendanceIndexPageComponent],
  template: '<app-attendance-index-page></app-attendance-index-page>',
})
export class AttendanceUploadPageComponent {}