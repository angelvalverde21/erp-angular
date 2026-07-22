import { CustomNavData } from '../../../interfaces/nav.interface';

export const navManufactures: CustomNavData[] = [
  {
    title: true,
    name: 'Ordenes de Compra',
  },
  {
    name: 'Ordenes de Compra',
    url: 'dashboard/acquires',
    iconComponent: { name: 'cil-chart-line' },
    children: [
      {
        name: 'Ordenes',
        url: 'dashboard/acquires',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Recepciones',
        url: 'dashboard/acquires/kardexes',
        icon: 'nav-icon-bullet',
      },
    ],
    roles: ['ceo', 'master'],
  },
//   {
//     title: true,
//     name: 'Producciones',
//   },
//   {
//     name: 'Campañas',
//     url: 'dashboard/marketing',
//     iconComponent: { name: 'cil-chart-line' },
//     children: [
//       {
//         name: 'TikTok',
//         url: 'dashboard/marketing/tiktok',
//         icon: 'nav-icon-bullet',
//       },
//       {
//         name: 'Instagram',
//         url: 'dashboard/marketing/instagram',
//         icon: 'nav-icon-bullet',
//       },
//       {
//         name: 'Facebook',
//         url: 'dashboard/marketing/facebook',
//         icon: 'nav-icon-bullet',
//       },
//     ],
//     roles: ['ceo', 'master'],
//   },
];
