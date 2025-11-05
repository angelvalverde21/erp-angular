import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Erp'
  },
  {
    name: 'Orders',
    url: 'orders',
    iconComponent: { name: 'cil-cash' },
    children: [
      {
        name: 'Orders',
        url: 'orders',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Clientes',
        url: 'orders/create',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cotizaciones',
        url: 'orders/quotes',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Productos',
    url: 'products',
    iconComponent: { name: 'cil-industry' },
    children: [
      {
        name: 'Productos',
        url: 'dashboard/products',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Categorias',
        url: 'dashboard/categories',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'inventario',
        url: 'dashboard/inventories',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Inventario',
    url: 'inventories',
    iconComponent: { name: 'cil-industry' },
    children: [
      {
        name: 'Productos',
        url: 'inventories/products',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Categorias',
        url: 'inventories/categories',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Almacenes',
        url: 'inventories/warehouses',
        icon: 'nav-icon-bullet'
      },
    ]
  },

  {
    title: true,
    name: 'Shopify'
  },
  {
    name: 'Inventario',
    url: 'inventories',
    iconComponent: { name: 'cil-industry' },
    children: [
      {
        name: 'Productos',
        url: 'inventories/products',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Ventas',
    url: 'shopify',
    iconComponent: { name: 'cil-cash' },
    children: [
      {
        name: 'Pedidos',
        url: 'shopify/orders',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Reportes',
    url: 'shopify/reports',
    iconComponent: { name: 'cil-chart-line' },
    children: [
      {
        name: 'Ultimos 7 Dias',
        url: 'dashboard/shopify/reports/daily/7',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Top 10 +Ventas',
        url: 'dashboard/shopify/reports/top',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Totales',
        url: 'dashboard/shopify/reports/all',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    title: true,
    name: 'Pasarellas'
  },
  {
    name: 'Mercado Pago',
    url: 'mercadopago',
    iconComponent: { name: 'cil-money' },
    children: [
      {
        name: 'Generar Link',
        url: 'dashboard/mercadopago/generate-link',
        icon: 'nav-icon-bullet'
      },
            {
      name: 'Config',
        url: 'dashboard/mercadopago/token',
        iconComponent: { name: 'cil-cog' },
      },
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Ayuda',
    url: 'https://3b.pe',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
