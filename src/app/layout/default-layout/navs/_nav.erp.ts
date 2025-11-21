import { INavData } from '@coreui/angular';

export const navErp: INavData[] = [
    {
        title: true,
        name: 'Erp'
    },
    // {
    //     name: 'Orders',
    //     url: 'orders',
    //     iconComponent: { name: 'cil-cash' },
    //     children: [
    //         { name: 'Orders', url: 'orders', icon: 'nav-icon-bullet' },
    //         { name: 'Clientes', url: 'orders/create', icon: 'nav-icon-bullet' },
    //         { name: 'Cotizaciones', url: 'orders/quotes', icon: 'nav-icon-bullet' }
    //     ]
    // },
    // {
    //     name: 'Productos',
    //     url: 'dashboard/products',
    //     iconComponent: { name: 'cil-industry' },
    //     children: [
    //         { name: 'Productos', url: 'dashboard/products', icon: 'nav-icon-bullet' },
    //         { name: 'Categorias', url: 'dashboard/categories', icon: 'nav-icon-bullet' },
    //         { name: 'Inventario', url: 'dashboard/inventories', icon: 'nav-icon-bullet' }
    //     ]
    // }
    {
        name: 'Produccion',
        url: 'dashboard/production',
        iconComponent: { name: 'cil-industry' },
        children: [
            { name: 'Recepcion', url: 'dashboard/production/receptions', icon: 'nav-icon-bullet' },
            { name: 'Compras', url: 'dashboard/production/compras', icon: 'nav-icon-bullet' },
            { name: 'Proveedores', url: 'dashboard/production/proveedores', icon: 'nav-icon-bullet' }
        ]
    },
    {
        name: 'Colaboradores',
        url: 'dashboard/employees',
        iconComponent: { name: 'cil-industry' },
        children: [
            { name: 'Colaboradores', url: 'dashboard/employees', icon: 'nav-icon-bullet' },
            { name: 'Crear', url: 'dashboard/employees/create', icon: 'nav-icon-bullet' },
        ]
    }
];