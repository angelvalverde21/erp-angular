import { Component, DestroyRef, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { filterNavigation } from './navs/filter-navigation';
import { dashboardRoles } from '../../views/dashboard/area-dashboards/dashboard.model';
import { NgClass, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { INavData } from '@coreui/angular';
import { BaseService } from '../../views/base.service';
import { IconDirective } from '@coreui/icons-angular';
import { CustomNavData } from '../../interfaces/nav.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,    SidebarFooterComponent,
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
    NgClass,
    NgTemplateOutlet,
    IconDirective,
    RouterModule
  ],
})
export class DefaultLayoutComponent implements OnInit {

  public navItems: INavData[] = [];

  storeName: string = '';

  user: any;

  constructor(
    private _base: BaseService,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }

  openMenus = new Set<INavData>();

  isExternalUrl(url: unknown): boolean {
    return typeof url === 'string' && /^(https?:|mailto:|tel:)/i.test(url);
  }

  toggleMenu(item: INavData, siblings: INavData[]): void {
    const wasOpen = this.openMenus.has(item);
    siblings.forEach(sibling => this.closeMenuBranch(sibling));
    if (wasOpen) return;

    this.openMenus.add(item);
    const firstChildUrl = item.children?.[0]?.url;
    if (typeof firstChildUrl === 'string') this.router.navigateByUrl(firstChildUrl);
  }

  private closeMenuBranch(item: INavData): void {
    this.openMenus.delete(item);
    item.children?.forEach(child => this.closeMenuBranch(child));
  }

  private syncOpenMenus(url: string): void {
    const path = url.split(/[?#]/)[0].replace(/\/$/, '');
    this.openMenus.clear();
    const visit = (items: INavData[]) => {
      items.forEach(item => {
        if (!item.children?.length || typeof item.url !== 'string') return;
        const itemPath = item.url.replace(/\/$/, '');
        if (path === itemPath || path.startsWith(itemPath + '/')) this.openMenus.add(item);
        visit(item.children);
      });
    };
    visit(this.navItems);
  }

  store: string | null = '';

  ngOnInit(): void {

    // Obtengo el usuario de localStorage
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.store = this._base.store;

    // Obtengo sus roles
    const localroles = dashboardRoles(this.user);

    // Filtro en el menu solo los roles permitidos
    this.navItems = filterNavigation(navItems, localroles);

    this.storeName = this._base.storeName!;
    this.navItems = this.addToStore([...this.navItems], this.storeName);
    this.syncOpenMenus(this.router.url);

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.syncOpenMenus(event.urlAfterRedirects);
      }
    });
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
