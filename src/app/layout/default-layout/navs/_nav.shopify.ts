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
      {
        name: 'Pedidos', url: 'dashboard/shopify/orders', icon: 'nav-icon-bullet', linkProps: {
          routerLinkActiveOptions: { exact: true }
        }
      },
      {
        name: 'Crear', url: 'dashboard/shopify/orders/create', icon: 'nav-icon-bullet', linkProps: {
          routerLinkActiveOptions: { exact: true }
        }
      }
    ],
    // roles: ['ventas', 'despacho']
  },
  {
    name: 'Productos',
    url: 'dashboard/shopify/products',
    iconComponent: { name: 'cil-cash' },
    children: [
      { name: 'Productos', url: 'dashboard/shopify/products/all', icon: 'nav-icon-bullet' },
      { name: 'Precios Masivos', url: 'dashboard/shopify/products/prices', icon: 'nav-icon-bullet', roles: ['master', 'ceo'] }
    ],
    // roles: ['ventas', 'despacho']
  },

];
