import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-void-index',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './void-index.component.html',
  styleUrl: './void-index.component.scss'
})
export class VoidIndexComponent {


  faInbox = faInbox;

  @Input() title: string = 'No hay registros'; 
  @Input() subtitle: string = 'Comienza agregando un registro'; 

}
