import { navErp } from './navs/_nav.erp';
import { navShopify } from './navs/_nav.shopify';
import { navMercadoPago } from './navs/_nav.mercadopago';
import { CustomNavData } from '../../interfaces/nav.interface';
import { navConfig } from './navs/_nav.config';
import { navReport } from './navs/_nav.report';
import { buildNav } from './navs/build.nav';
import { navMarketing } from './navs/_nav.marketing';

export const navItems: CustomNavData[] = buildNav([

  {
    name: 'Dashboard',
    url: 'dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },

  // ✅ Combina los módulos aquí
  ...navErp,
  ...navMarketing,
  ...navConfig,
  ...navShopify,
  ...navMercadoPago,
  ...navReport,
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

]);
