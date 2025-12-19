import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-paginator',
  imports: [
    RouterModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {

  @Input() links: any[] = [];

  getQueryParams(link: any): any {
    if (!link?.url) return null;

    const query = link.url.split('?')[1];
    if (!query) return null;

    const params = new URLSearchParams(query);
    const page = Math.max(1, Number(params.get('page')) || 1);

    return { page };
  }

}
