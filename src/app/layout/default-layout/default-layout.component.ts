import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { environment } from '../../core/environments/environment';
import { UpperCasePipe } from '@angular/common';
import { StoreService } from '../../core/services/store.service';
import { INavData } from '@coreui/angular';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    UpperCasePipe,
  ],
})

export class DefaultLayoutComponent implements OnInit {

  storeName: string = ''; // ya no string | null
  public navItems: INavData[] = [];

  constructor(private _store: StoreService) {
    this.storeName = this._store.name()!; // el servicio ya tiene el nombre
  }

  ngOnInit(): void {
    this.navItems = this.setBasePath(navItems);
  }

  private setBasePath(items: INavData[]): INavData[] {
    return items.map((item) => {
      const newItem: INavData = { ...item };

      // Si la URL es string y no es externa (http/https)
      if (typeof newItem.url === 'string' && !newItem.url.startsWith('http')) {
        // Evita duplicar storeName si ya lo tiene
        if (!newItem.url.startsWith(`/${this.storeName}`)) {
          newItem.url = `/${this.storeName}${newItem.url.startsWith('/') ? '' : '/'}${newItem.url}`;
        }
      }

      // Procesar hijos de forma recursiva
      if (newItem.children) {
        newItem.children = this.setBasePath(newItem.children);
      }

      return newItem;
    });
  }
}
