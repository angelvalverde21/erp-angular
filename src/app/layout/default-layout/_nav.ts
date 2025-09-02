
import { INavData } from '@coreui/angular';
import { environment } from '../../core/environments/environment';


export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
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
    name: 'Inventario',
    url: 'inventories',
    iconComponent: { name: 'cil-industry' },
    children: [
        {
          name: 'Productos',
          url: 'inventories/products',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Categorias',
          url: 'inventories/categories',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Almacenes',
          url: 'inventories/warehouses',
          icon: 'nav-icon-bullet'
        },
    ]
  },

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
];
