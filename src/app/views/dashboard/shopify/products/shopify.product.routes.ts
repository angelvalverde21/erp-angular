import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopify-product-index-page/shopify-product-index-page.component').then((m) => m.ShopifyProductIndexPageComponent),
    data: {
      title: 'Productos',
      // name: 'shopify.order.index', // 👈 nombre único
    },
    
  },
  {
    path: 'prices',
    loadComponent: () => import('./prices/shopify-product-price-index-page/shopify-product-price-index-page.component').then((m) => m.ShopifyProductPriceIndexPageComponent),
    data: {
      title: 'Lista de precios',
      // name: 'shopify.order.index', // 👈 nombre único
    },
    
  },
  {
    path: 'prices/search',
    loadComponent: () => import('./prices/shopify-product-price-search-page/shopify-product-price-search-page.component').then((m) => m.ShopifyProductPriceSearchPageComponent),
    data: {
      title: 'Lista de precios',
      // name: 'shopify.order.index', // 👈 nombre único
    },
    
  },
];
