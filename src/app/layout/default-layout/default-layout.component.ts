import { Component, effect, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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

  storeName: string = ""

  constructor(private _base: BaseService, private router: Router) {

  }

  ngOnInit(): void {

    // const currentUrl = this.router.url;

    //Obtengo el usuario de localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    //Obtengo sus roles
    const localroles = user.roles || [];

    //Filtro en el menu solo los roles permitidos
    this.navItems = navItems.filter((navItem: any) => {
      // Si item no tiene roles definidos, osea no hay restriccion se muestra de frente



      if (!navItem.roles) return true;

      // En caso haya restriccion, Si alguno de los roles del user coincide -> mostrar
      if (localroles.includes('master') || localroles.includes('ceo')) {
        return true;
      }

      return navItem.roles.some((role: any) => localroles.includes(role)); //Devuelve verdadero o falso segun eso quita o no un item del navItems
      // const result = navItem.roles.some((role:any) => roles.includes(role));
      // console.log('Resultado permiso:', result);
      // return result;

    });

    // this.navItems = navItems;

    // const store = this._base.store;

    // if (store) {
    //   this.navItems = this.addToStore([...this.navItems], store);
    //   this.storeName = store;
    // } else {
    //   // Si el store aún no está cargado, esperar a que esté listo
    //   effect(() => {
    //     const currentStore = this._base.store;
    //     if (currentStore) {
    //       this.navItems = this.addToStore([...this.navItems], currentStore);
    //       this.storeName = currentStore;
    //     }
    //   });
    // }

    this.storeName = this._base.storeName!;
    this.navItems = this.addToStore([...this.navItems], this.storeName);

    // this.navItems = this.setBasePath(navItems);
  }

  addToStore(navItems: CustomNavData[], storeName: string) {

    navItems.forEach((item: CustomNavData) => {

      if (typeof item.url === 'string' && item.url.trim() !== '') {
        // Evita duplicar el store si ya está presente
        if (!item.url.startsWith(`/${storeName}/`)) {
          item.url = `/${storeName}/${item.url.replace(/^\//, '')}`;
        }
      }

      // Procesar recursivamente los hijos
      if (item.children && item.children.length > 0) {
        this.addToStore(item.children, storeName);
      }

    });

    return navItems;

  }

}
