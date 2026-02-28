import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTag, faFileExport } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-head-page',
  imports: [FontAwesomeModule],
  templateUrl: './head-page.component.html',
  styleUrl: './head-page.component.scss'
})
export class HeadPageComponent {

  // faTag = faTag;
  faFileExport = faFileExport;
  
  @Input() title: string = ""; 
  @Input() subtitle: string = "Gestión de la información"; 
  @Input() icon = faTag;
  @Input() export: boolean = true;

}
