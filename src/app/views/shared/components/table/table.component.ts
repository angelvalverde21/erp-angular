import { Component, Input } from '@angular/core';
import { RowComponent } from './row/row.component';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-table',
  imports: [
    RowComponent,
    FontAwesomeModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  faSort = faSort;

  @Input() data: any[] = [];

}
