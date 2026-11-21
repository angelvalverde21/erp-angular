import { CustomNavData } from '../../../interfaces/nav.interface';

export const navInitialImport: CustomNavData[] = [{
  name: 'Primera importación', url: 'dashboard/initial-import', icon: 'fa-solid fa-cloud-arrow-down', roles: ['master', 'ceo', 'admin'],
  children: [
    { name: 'Datos de Shopify', url: 'dashboard/initial-import/shopify', icon: 'nav-icon-bullet', linkProps: { routerLinkActiveOptions: { exact: true } } },
    { name: 'Pedidos', url: 'dashboard/initial-import/orders', icon: 'nav-icon-bullet' },
    { name: 'Pedidos · Nueva versión', url: 'dashboard/orders-next', icon: 'nav-icon-bullet' },
  ],
}];
