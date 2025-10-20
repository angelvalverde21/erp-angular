import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge-status',
  imports: [],
  templateUrl: './badge-status.component.html',
  styleUrl: './badge-status.component.scss'
})
export class BadgeStatusComponent {

    @Input() status: string = ''; 

}
