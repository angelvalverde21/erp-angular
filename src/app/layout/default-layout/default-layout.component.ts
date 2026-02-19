import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

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
import { UpperCasePipe } from '@angular/common';
import { INavData } from '@coreui/angular';
import { BaseService } from '../../views/base.service';
import { IconDirective } from '@coreui/icons-angular';
import { CustomNavData } from '../../interfaces/nav.interface';

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
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    UpperCasePipe,
    IconDirective,
  ],
})
export class DefaultLayoutComponent implements OnInit {

  public navItems: INavData[] = [];

  storeName: string = '';

  user: any;

  constructor(
    private _base: BaseService,
    private router: Router
  ) { }

  @HostListener('document:click', ['$event'])
  onNavGroupClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const toggle = target.closest('.nav-group-toggle') as HTMLElement;

    if (!toggle) return;

    const navGroup = toggle.closest('.nav-group');
    const navItems = navGroup?.querySelector('.nav-group-items') as HTMLElement;

    if (!navItems) return;

    const isClosed = navItems.offsetHeight === 0;

    // ✅ Solo navegar si está cerrado
    if (isClosed) {
      const firstChildUrl = toggle.getAttribute('data-first-child');
      if (firstChildUrl) {
        this.router.navigateByUrl(firstChildUrl);
      }
    }
  }



  ngOnInit(): void {

    // Obtengo el usuario de localStorage
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // Obtengo sus roles
    const localroles = this.user.roles || [];

    // Filtro en el menu solo los roles permitidos
    this.navItems = navItems.filter((navItem: any) => {
      // Si item no tiene roles definidos, no hay restriccion -> se muestra
      if (!navItem.roles) return true;
      // Si alguno de los roles del user coincide -> mostrar
      return navItem.roles.some((role: any) => localroles.includes(role));
    });

    this.storeName = this._base.storeName!;
    this.navItems = this.addToStore([...this.navItems], this.storeName);
  }

  addToStore(navItems: CustomNavData[], storeName: string): CustomNavData[] {

    navItems.forEach((item: CustomNavData) => {

      // Actualiza la URL del ítem con el storeName
      if (typeof item.url === 'string' && item.url.trim() !== '') {
        if (!item.url.startsWith(`/${storeName}/`)) {
          item.url = `/${storeName}/${item.url.replace(/^\//, '')}`;
        }
      }

      // Procesar recursivamente los hijos primero
      if (item.children && item.children.length > 0) {
        this.addToStore(item.children, storeName);

        // 👇 Actualiza data-first-child DESPUÉS de procesar hijos
        // para que tenga la URL ya actualizada con el storeName
        if (item.attributes) {
          item.attributes['data-first-child'] = item.children[0].url as string;
        }
      }

    });

    return navItems;
  }

}