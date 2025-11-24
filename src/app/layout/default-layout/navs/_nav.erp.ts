import { CustomNavData } from '../../../interfaces/nav.interface';

export const navErp: CustomNavData[] = [
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
    // {
    //     name: 'Produccion',
    //     url: 'dashboard/productions',
    //     iconComponent: { name: 'cil-industry' },
    //     children: [
    //         { name: 'Ordenes de Produccion', url: 'dashboard/productions/orders', icon: 'nav-icon-bullet' },
    //         { name: 'Ordenes de compra', url: 'dashboard/productions/purchase/orders', icon: 'nav-icon-bullet' },
    //         { name: 'Proveedores', url: 'dashboard/productions/suppliers', icon: 'nav-icon-bullet' },
    //     ]
    // },
    {
        name: 'Manufactura',
        url: 'dashboard/manufacturing',
        iconComponent: { name: 'cil-industry' },
        children: [
            { name: 'Ordenes de Produccion', url: 'dashboard/productions/orders', icon: 'nav-icon-bullet' },
        ]
    },
    {
        name: 'Compras',
        url: 'dashboard/purchases',
        iconComponent: { name: 'cil-notes' },
        children: [
            { name: 'Ordenes de compra', url: 'dashboard/purchases/orders', icon: 'nav-icon-bullet' },
        ]
    },
    {
        name: 'Movimientos',
        url: 'dashboard/movements',
        iconComponent: { name: 'cil-swap-horizontal' },
        children: [
            {
                name: 'Entradas y Salidas',
                url: 'dashboard/users/movements',
                icon: 'nav-icon-bullet'
            },
            {
                name: 'Transferencias',
                url: 'dashboard/users/transfers',
                icon: 'nav-icon-bullet'
            }
        ]
    },
    {
        name: 'Usuarios',
        url: 'dashboard/users',
        iconComponent: { name: 'cil-user' },
        children: [
            { name: 'Clientes', url: 'dashboard/users/customers', icon: 'nav-icon-bullet' },
            { name: 'Colaboradores', url: 'dashboard/users/employees', icon: 'nav-icon-bullet' },
            { name: 'Proveedores', url: 'dashboard/users/suppliers', icon: 'nav-icon-bullet' },
        ]
    }
];

