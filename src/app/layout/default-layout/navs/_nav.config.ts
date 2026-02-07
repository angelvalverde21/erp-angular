import { CustomNavData } from '../../../interfaces/nav.interface';

export const navConfig: CustomNavData[] = [
    {
        title: true,
        name: 'Config',
    },
    {
        name: 'Gateways',
        url: 'dashboard/gateways',
        iconComponent: { name: 'cil-credit-card' },
        children: [
            {
                name: 'Todos', url: 'dashboard/gateways', icon: 'nav-icon-bullet',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
            {
                name: 'Crear', url: 'dashboard/gateways/create', icon: 'nav-icon-bullet',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
        ],
        roles: ['master', 'ceo']
    },
    {
        name: 'Couriers',
        url: 'dashboard/couriers',
        iconComponent: { name: 'cil-truck' },
        children: [
            {
                name: 'Todos', url: 'dashboard/couriers', icon: 'nav-icon-bullet',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
            {
                name: 'Crear', url: 'dashboard/couriers/create', icon: 'nav-icon-bullet',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
        ],
        roles: ['master', 'ceo']
    }
];

