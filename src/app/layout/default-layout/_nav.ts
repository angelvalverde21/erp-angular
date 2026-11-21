import { navErp } from './navs/_nav.erp';
import { navInventories } from './navs/_nav.inventories';
import { navOrders } from './navs/_nav.orders';
import { navPhotoSessions } from './navs/_nav.photo-sessions';
import { navShopify } from './navs/_nav.shopify';
import { navPasarelas } from './navs/_nav.pasarelas';
import { CustomNavData } from '../../interfaces/nav.interface';
import { navConfig } from './navs/_nav.config';
import { navStore } from './navs/_nav.store';
import { navDashboards } from './navs/_nav.dashboards';
import { navMigrations } from './navs/_nav.migrations';
import { navInitialImport } from './navs/_nav.initial-import';
import { navReport } from './navs/_nav.report';
import { buildNav } from './navs/build.nav';
import { navMarketing } from './navs/_nav.marketing';
import { navManufactures } from './navs/_nav.manufactures';
import { navAcquires } from './navs/_nav.acquires';

export const navItems: CustomNavData[] = buildNav([
  ...navDashboards,

  // ✅ Combina los módulos aquí
  // ...navInventory,
  ...navOrders,
  ...navPhotoSessions,
  ...navInventories,
  ...navErp,
  // ...navMarketing,
  ...navConfig,
  ...navStore,
  // ...navAcquires,
  ...navShopify,
  ...navMigrations,
  ...navInitialImport,
  ...navPasarelas,
  ...navReport,
  {
    title: true,
    name: 'Links',
    class: 'mt-auto',
  },
  {
    name: 'Ayuda',
    url: 'https://3b.pe',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
  },
]);
