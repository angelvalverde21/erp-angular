import { CustomNavData } from '../../../interfaces/nav.interface';

export function filterNavigation(items: CustomNavData[], roles: string[]): CustomNavData[] {
  return items.filter(item => !item.roles || item.roles.some(role => roles.includes(role)))
    .map(item => ({
      ...item,
      ...(item.children ? { children: filterNavigation(item.children, roles) } : {}),
    }));
}
