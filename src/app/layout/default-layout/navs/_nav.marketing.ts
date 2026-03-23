import { CustomNavData } from '../../../interfaces/nav.interface';

export const navMarketing: CustomNavData[] = [
    {
        title: true,
        name: 'Marketing',
    },
    {
        name: 'Campañas',
        url: 'dashboard/marketing',
        iconComponent: { name: 'cil-chart-line' },
        children: [
            { name: 'TikTok', url: 'dashboard/marketing/tiktok', icon: 'nav-icon-bullet' },
            { name: 'Instagram', url: 'dashboard/marketing/instagram', icon: 'nav-icon-bullet' },
            { name: 'Facebook', url: 'dashboard/marketing/facebook', icon: 'nav-icon-bullet' },
        ],
        roles: ['ceo', 'master']
    }
]