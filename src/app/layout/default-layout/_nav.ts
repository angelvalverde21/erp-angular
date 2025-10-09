
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
    name: 'Ventas',
    url: 'orders',
    iconComponent: { name: 'cil-cash' },
    children: [
      {
        name: 'Pedidos',
        url: 'orders',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Clientes',
        url: 'orders/create',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cotizaciones',
        url: 'orders/quotes',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Mercado Pago',
    url: 'mercadopago',
    iconComponent: { name: 'cil-money' },
    children: [
      {
        name: 'Generar Link',
        url: 'mercadopago/generate-link',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Reportes',
    url: 'reports',
    iconComponent: { name: 'cil-money' },
    children: [
      {
        name: 'Ultimos 7 Dias',
        url: 'reports/daily/7',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Top 10 +Ventas',
        url: 'reports/top',
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
