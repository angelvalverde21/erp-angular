import { CustomNavData } from '../../../interfaces/nav.interface';

export function buildNav(items: CustomNavData[]): CustomNavData[] {
    return items.map(item => {
        if (item.children?.length) {
            const firstUrl = item.children[0].url as string;
            return {
                ...item,
                attributes: {
                    ...item.attributes,
                    'data-first-child': firstUrl
                },
                // Aplica recursivamente a hijos que también tengan children
                children: buildNav(item.children)
            };
        }
        return item;
    });
}