import { CustomNavData } from '../../../interfaces/nav.interface';

export const navPasarelas: CustomNavData[] = [
  {
    title: true,
    name: 'Pasarelas',
  },
  {
    name: 'Mercado Pago',
    url: 'dashboard/pasarelas',
    iconComponent: { name: 'cil-money' },
    children: [
      { name: 'Generar Link', url: 'dashboard/pasarelas/generate-link', iconComponent: { name: 'cil-link' } },
      { name: 'Movimientos', url: 'dashboard/pasarelas/transactions', iconComponent: { name: 'cil-stream' } },
      { name: 'Config', url: 'dashboard/pasarelas/token', iconComponent: { name: 'cil-cog' } }
    ],
    // roles: ['despacho']
  },
  {
    name: 'Yape',
    url: 'dashboard/yapes',
    iconComponent: { name: 'cil-money' },
    children: [
      { name: 'Movimientos', url: 'dashboard/yapes', iconComponent: { name: 'cil-stream' }, class: 'children-custom', },
    ],
    roles: ['master', 'ceo']
  }
];
