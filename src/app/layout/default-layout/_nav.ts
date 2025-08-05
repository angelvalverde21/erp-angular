import { INavData } from '@coreui/angular';
import { environment } from '../../../app/core/environments/environment';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/dashboard',
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
    name: 'Productos',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/products` : '/products',
    iconComponent: { name: 'cil-barcode' }
  },
  {
    name: 'Categorias',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/categories` : '/categories',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Settings',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/settings` : '/settings',
    iconComponent: { name: 'cil-settings' }
  },

    {
    name: 'Website',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/web` : '/web',
    iconComponent: { name: 'cil-house' },
        children: [
      {
        name: 'Carousel',
        url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/website/carousel` : '/website/carousel',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Ofertas',
        url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/website/deals` : '/website/deals',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Reporte',
        url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/website/reports` : '/website/reports',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  // {
  //   name: 'Warehouses',
  //   url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/warehouses',
  //   iconComponent: { name: 'cil-bank' }
  // },
  // {
  //   title: true,
  //   name: 'Ventas'
  // },
  // {
  //   name: 'Resumen',
  //   url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/orders/resumen',
  //   iconComponent: { name: 'cil-barcode' }
  // },
  // {
  //   name: 'Reporte',
  //   url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/orders/reports',
  //   iconComponent: { name: 'cil-bar-chart' }
  // },

  // {
  //   name: 'ARA',
  //   url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/warehouses',
  //   iconComponent: { name: 'cil-industry' },
  //   children: [
  //     {
  //       name: 'Ventas',
  //       url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/warehouses/1/orders',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Crear',
  //       url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/warehouses/1/orders/create',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Reporte',
  //       url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/warehouses/1/orders/reports',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  // {
  //   name: 'Components',
  //   title: true
  // },

  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Ayuda',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/ayuda` : 'https://3b.pe',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
