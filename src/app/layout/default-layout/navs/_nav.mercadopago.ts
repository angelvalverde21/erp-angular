import { CustomNavData } from '../../../interfaces/nav.interface';

export const navMercadoPago: CustomNavData[] = [

  {
    name: 'Mercado Pago',
    url: 'dashboard/mercadopago',
    iconComponent: { name: 'cil-money' },
    children: [
      { name: 'Generar Link', url: 'dashboard/mercadopago/generate-link', iconComponent: { name: 'cil-link' } },
      { name: 'Movimientos', url: 'dashboard/mercadopago/transactions', iconComponent: { name: 'cil-stream' } },
      { name: 'Config', url: 'dashboard/mercadopago/token', iconComponent: { name: 'cil-cog' } }
    ],
    roles: ['despacho']
  }

];
