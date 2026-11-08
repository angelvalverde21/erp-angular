import { CustomNavData } from '../../../interfaces/nav.interface';

export const navStore: CustomNavData[] = [
  {
    title: true,
    name: 'Store',
    roles: ['master', 'ceo'],
  },
  {
    name: 'Sucursales',
    url: 'dashboard/branches',
    icon: 'fa-solid fa-building',
    roles: ['master', 'ceo'],
    children: [
      {
        name: 'Todas las sucursales',
        url: 'dashboard/branches',
        icon: 'nav-icon-bullet',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
      {
        name: 'Agregar sucursal',
        url: 'dashboard/branches/create',
        icon: 'nav-icon-bullet',
        linkProps: { routerLinkActiveOptions: { exact: true } },
      },
    ],
  },
];
