import { CustomNavData } from '../../../interfaces/nav.interface';

export const navShopify: CustomNavData[] = [

  {
    title: true,
    name: 'Shopify',
  },
  {
    name: 'Ventas',
    url: 'dashboard/shopify/orders',
    iconComponent: { name: 'cil-cash' },
    children: [
      { name: 'Pedidos', url: 'dashboard/shopify/orders', icon: 'nav-icon-bullet' }
    ],
    // roles: ['ventas', 'despacho']
  },
  {
    name: 'Productos',
    url: 'dashboard/shopify/products',
    iconComponent: { name: 'cil-cash' },
    children: [
      { name: 'Productos', url: 'dashboard/shopify/products/all', icon: 'nav-icon-bullet' },
      { name: 'Precios', url: 'dashboard/shopify/products/prices', icon: 'nav-icon-bullet' }
    ],
    // roles: ['ventas', 'despacho']
  },
  {
    name: 'Reportes',
    url: 'dashboard/shopify/reports',
    iconComponent: { name: 'cil-chart-line' },
    children: [
      { name: 'Últimos 7 Días', url: 'dashboard/shopify/reports/bars/daily', icon: 'nav-icon-bullet' },
      { name: 'Mensual', url: 'dashboard/shopify/reports/bars/months', icon: 'nav-icon-bullet' },
      { name: 'Top 10', url: 'dashboard/shopify/reports/top', icon: 'nav-icon-bullet' },
      { name: 'Ventas Totales', url: 'dashboard/shopify/reports/all', icon: 'nav-icon-bullet' }
    ],
    roles: ['ceo']
  }
];
