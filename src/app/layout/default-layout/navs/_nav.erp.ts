import { CustomNavData } from '../../../interfaces/nav.interface';

export const navErp: CustomNavData[] = [
    {
        title: true,
        name: 'Erp',
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
    //     name: 'Products',
    //     url: 'dashboard/products',
    //     iconComponent: { name: 'cil-industry' },
    //     children: [
    //         { name: 'Products', url: 'dashboard/products', icon: 'nav-icon-bullet' },
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
        name: 'Fabricacion',
        url: 'dashboard/manufactures',
        iconComponent: { name: 'cil-industry' },
        children: [
            {
                name: 'Todos',
                url: 'dashboard/manufactures',
                icon: 'fas fa-gears',
                class: 'children-custom',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                },
            },
            {
                name: 'Producciones',
                url: 'dashboard/manufactures/productions',
                icon: 'fas fa-gears',
                class: 'children-custom',
                linkProps: {
                    routerLinkActiveOptions: { exact: false }
                },
            },
            {
                name: 'Ordenes de compra', 
                url: 'dashboard/manufactures/orders', 
                icon: 'fa-solid fa-boxes-stacked', 
                class: 'children-custom',
                linkProps: {
                    routerLinkActiveOptions: { exact: false }
                },
            },
        ],
        roles: ['master', 'ceo']
    },
    // {
    //     name: 'Compras',
    //     url: 'dashboard/purchases',
    //     iconComponent: { name: 'cil-notes' },
    //     children: [
    //         {
    //             name: 'Ordenes de compra', url: 'dashboard/purchases/orders', icon: 'nav-icon-bullet',
    //             linkProps: {
    //                 routerLinkActiveOptions: { exact: true }
    //             },
    //         },
    //         {
    //             name: 'Compras', url: 'dashboard/purchases', icon: 'nav-icon-bullet',
    //             linkProps: {
    //                 routerLinkActiveOptions: { exact: true }
    //             },
    //         },
    //     ],
    //     roles: ['master']
    // },
    {
        name: 'Movimientos',
        url: 'dashboard/transactions',
        iconComponent: { name: 'cil-swap-horizontal' },
        children: [
            {
                name: 'Entradas y Salidas',
                url: 'dashboard/users/transactions',
                icon: 'nav-icon-bullet'
            },
            {
                name: 'Transferencias',
                url: 'dashboard/users/transfers',
                icon: 'nav-icon-bullet'
            }
        ],
        roles: ['master']
    },
    {
        name: 'Productos',
        url: 'dashboard/products',
        iconComponent: { name: 'cil-barcode' },
        children: [
            {
                name: 'productos',
                url: 'dashboard/products',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
            {
                name: 'Colecciones',
                url: 'dashboard/collections',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
            {
                name: 'Inventario',
                url: 'dashboard/products/inventory',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
        ],
        roles: ['master']
    },
    {
        name: 'Caja chica',
        url: '/dashboard/pettycashes',
        icon: 'fa-solid fa-comments-dollar',
        children: [
            {
                name: 'Todos', url: '/dashboard/pettycashes', icon: 'nav-icon-bullet',
                linkProps: {
                    routerLinkActiveOptions: { exact: true }
                }
            },
        ],
        roles: ['ceo', 'master']
    },
    {
        name: 'Usuarios',
        url: 'dashboard/users',
        iconComponent: { name: 'cil-user' },
        children: [
            { name: 'Clientes', url: 'dashboard/users/customers', icon: 'nav-icon-bullet' },
            { name: 'Colaboradores', url: 'dashboard/users/employees', icon: 'nav-icon-bullet' },
            { name: 'Proveedores', url: 'dashboard/users/suppliers', icon: 'nav-icon-bullet' },
        ],
        roles: ['ceo', 'master']
    },

];

