import { CustomNavData } from '../../../interfaces/nav.interface';
import { DASHBOARDS, MANAGEMENT_ROLES } from '../../../views/dashboard/area-dashboards/dashboard.model';

export const navDashboards: CustomNavData[] = [
  {
    name: 'Dashboard',
    url: 'dashboard/panels',
    icon: 'fa-solid fa-gauge-high',
    roles: [...MANAGEMENT_ROLES, 'sales', 'packing', 'marketing'],
    children: [
      { name: 'Vista general', url: 'dashboard/panels', icon: 'nav-icon-bullet', linkProps: { routerLinkActiveOptions: { exact: true } } },
      ...DASHBOARDS.map(area => ({
        name: area.name,
        url: `dashboard/panels/${area.key}`,
        icon: `fa-solid ${area.icon}`,
        roles: area.key === 'ceo' ? [...MANAGEMENT_ROLES] : [...MANAGEMENT_ROLES, area.role],
        linkProps: { routerLinkActiveOptions: { exact: true } },
      })),
    ],
  },
];
