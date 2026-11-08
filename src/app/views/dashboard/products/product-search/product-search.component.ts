import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-search',
  imports: [FontAwesomeModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  @Input() term = '';
  @Output() searchSubmit = new EventEmitter<Record<string, string>>();

  readonly searchIcon = faMagnifyingGlass;
  readonly clearIcon = faXmark;

  submit(event: Event): void {
    event.preventDefault();
    this.term = this.term.trim();
    this.searchSubmit.emit({ search: this.term });
  }

  clear(input: HTMLInputElement): void {
    this.term = '';
    this.searchSubmit.emit({ search: '' });
    input.focus();
  }
}
