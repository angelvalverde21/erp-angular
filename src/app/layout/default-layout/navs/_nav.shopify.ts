import { CustomNavData } from '../../../interfaces/nav.interface';

export const navShopify: CustomNavData[] = [

  {
    title: true,
    name: 'Shopify',
    roles: ['ceo']
  },
  {
    name: 'Ventas',
    url: 'dashboard/shopify',
    iconComponent: { name: 'cil-cash' },
    children: [
      { name: 'Pedidos', url: 'dashboard/shopify/orders', icon: 'nav-icon-bullet' }
    ],
    roles: ['ventas', 'despacho']
  },
  {
    name: 'Productos',
    url: 'dashboard/shopify',
    iconComponent: { name: 'cil-cash' },
    children: [
      { name: 'Productos', url: 'dashboard/shopify/products', icon: 'nav-icon-bullet' }
    ],
    roles: ['ventas', 'despacho']
  },
  {
    name: 'Reportes',
    url: 'shopify/reports',
    iconComponent: { name: 'cil-chart-line' },
    children: [
      { name: 'Últimos 7 Días', url: 'dashboard/shopify/reports/daily/7', icon: 'nav-icon-bullet' },
      { name: 'Top 10 +Ventas', url: 'dashboard/shopify/reports/top', icon: 'nav-icon-bullet' },
      { name: 'Totales', url: 'dashboard/shopify/reports/all', icon: 'nav-icon-bullet' }
    ]
  }
];
