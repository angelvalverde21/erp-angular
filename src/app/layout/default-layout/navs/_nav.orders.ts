import { CustomNavData } from '../../../interfaces/nav.interface';

export const navOrders: CustomNavData[] = [
  {
    name: 'Pedidos',
    url: 'dashboard/orders',
    icon: 'fa-solid fa-bag-shopping',
    children: [
      {
        name: 'Pedidos',
        url: 'dashboard/orders',
        icon: 'fa-solid fa-list-ul',
        class: 'children-custom',
        linkProps: {
          routerLinkActiveOptions: { exact: true }
        }
      },
      {
        name: 'Crear',
        url: 'dashboard/orders/create',
        icon: 'fa-solid fa-plus',
        class: 'children-custom',
        linkProps: {
          routerLinkActiveOptions: { exact: true }
        }
      }
    ]
  }
];
