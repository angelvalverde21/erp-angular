import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { BaseUrlService } from '../../core/base-url/base-url.service';


@Injectable({ providedIn: 'root' })
export class NavItemsService {
  constructor(private baseUrl: BaseUrlService) {}

  get navItems(): INavData[] {
    return [
        {
            name: 'Dashboard',
            url: this.baseUrl.getPathString('dashboard'),
            iconComponent: { name: 'cil-speedometer' },
            badge: {
            color: 'info',
            text: 'NEW'
            }
        },
        {
            title: true,
            name: 'Store (admin)'
        },

        {
            name: 'Compras',
            url: this.baseUrl.getPathString('purchases'),
            iconComponent: { name: 'cil-cart' },
                children: [
                {
                name: 'Proveedores',
                url: this.baseUrl.getPathString('suppliers'),
                icon: 'nav-icon-bullet'
                },
                {
                name: 'Ordenes de Compra',
                url: this.baseUrl.getPathString('purchase-order'),
                icon: 'nav-icon-bullet'
                },
                {
                name: 'Compras',
                url: this.baseUrl.getPathString('all'),
                icon: 'nav-icon-bullet'
                },
            ]
        },
        {
            name: 'Ventas',
            // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/sales` : '/sales',
            iconComponent: { name: 'cil-cash' },
                children: [
                {
                name: 'Clientes',
                // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/custumers` : '/custumers',
                icon: 'nav-icon-bullet'
                },
                {
                name: 'Cotizaciones',
                // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/quotes` : '/quotes',
                icon: 'nav-icon-bullet'
                },
                {
                name: 'ventas',
                // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/sales` : '/sales',
                icon: 'nav-icon-bullet'
                },
            ]
        },
        {
            name: 'Movimientos',
            // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/products` : '/products',
            iconComponent: { name: 'cil-loop' },
                children: [
                {
                name: 'Entradas y Salidas',
                // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/movements` : '/movements',
                icon: 'nav-icon-bullet'
                },
                {
                name: 'Transferencias',
                // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/transfers` : '/transfers',
                icon: 'nav-icon-bullet'
                }
            ]
        },

        {
            name: 'Reportes',
            // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/brands` : '/brands',
            iconComponent: { name: 'cil-chart-line' }
        },

        {
            title: true,
            name: 'Links',
            class: 'mt-auto'
        },
        {
            name: 'Ayuda',
            // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/ayuda` : 'https://3b.pe',
            iconComponent: { name: 'cil-description' },
            attributes: { target: '_blank' }
        }
    ];
  }
}