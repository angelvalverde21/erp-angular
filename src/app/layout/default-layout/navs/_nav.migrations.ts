import { CustomNavData } from '../../../interfaces/nav.interface';

export const navMigrations: CustomNavData[] = [{
  name: 'Migración',
  url: 'dashboard/migrations',
  icon: 'fa-solid fa-file-import',
  roles: ['master', 'ceo', 'admin'],
  children: [{
    name: 'Pedidos de Shopify',
    url: 'dashboard/migrations/shopify-orders',
    icon: 'nav-icon-bullet',
    linkProps: { routerLinkActiveOptions: { exact: true } },
  }],
}];
