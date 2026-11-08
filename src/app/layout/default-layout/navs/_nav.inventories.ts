import { CustomNavData } from '../../../interfaces/nav.interface';

export const navInventories: CustomNavData[] = [
  {
    title: true,
    name: 'Inventarios',
    roles: ['ceo', 'master'],
  },
  {
    name: 'Inventarios',
    url: 'dashboard/inventories',
    icon: 'fa-solid fa-clipboard-list',
    roles: ['ceo', 'master'],
    children: [
      {
        name: 'Inventarios',
        url: 'dashboard/inventories',
        icon: 'fa-solid fa-clipboard-list',
        class: 'children-custom',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
      {
        name: 'Crear inventario',
        url: 'dashboard/inventories/create',
        icon: 'fa-solid fa-circle-plus',
        class: 'children-custom',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
      {
        name: 'Código de barras',
        url: 'dashboard/inventories/barcode',
        icon: 'fa-solid fa-barcode',
        class: 'children-custom',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
      {
        name: 'Lotes',
        url: 'dashboard/inventories/batches',
        icon: 'fa-solid fa-cart-flatbed',
        class: 'children-custom',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
      {
        name: 'Traslados',
        url: 'dashboard/inventories/movements',
        icon: 'fa-solid fa-right-left',
        class: 'children-custom',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
    ],
  },
];
