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
    name: 'Inventario',
    // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/inventories` : '/inventories',
    iconComponent: { name: 'cil-industry' },
    children: [
        {
          name: 'Productos',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/products` : '/products',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Categorias',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/categories` : '/categories',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Almacenes',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/warehouses` : '/warehouses',
          icon: 'nav-icon-bullet'
        },
    ]
  },
  {
    name: 'Compras',
    // url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/purchases` : '/purchases',
    iconComponent: { name: 'cil-cart' },
        children: [
        {
          name: 'Proveedores',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/suppliers` : '/suppliers',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Ordenes de Compra',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/purchase-order` : '/purchase-order',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Compras',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/purchases` : '/purchases',
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
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/custumers` : '/custumers',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Cotizaciones',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/quotes` : '/quotes',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'ventas',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/sales` : '/sales',
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
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/movements` : '/movements',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Transferencias',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/transfers` : '/transfers',
          icon: 'nav-icon-bullet'
        }
    ]
  },

  {
    name: 'Reportes',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/brands` : '/brands',
    iconComponent: { name: 'cil-chart-line' }
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
