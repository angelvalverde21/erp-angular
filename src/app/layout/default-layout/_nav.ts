
import { INavData } from '@coreui/angular';
import { environment } from '../../core/environments/environment';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Store (admin)'
  },

  {
    name: 'Producciones',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/batches` : '/batches',
    iconComponent: { name: 'cil-cut' }
  },
  {
    name: 'Proveedores',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/suppliers` : '/suppliers',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Compras',
          url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/purchases` : '/purchases',
    iconComponent: { name: 'cil-cart' }
  },

  {
    name: 'Reportes',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/dashboard` : '/dashboard',
    iconComponent: { name: 'cil-chart-line' }
  },



  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Ayuda',
    url: (environment.showStoreNameInSlug) ? `/${environment.storeName}/ayuda` : 'https://3b.pe',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
