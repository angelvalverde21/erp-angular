import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Carousels',
    },
    children: [
        {
            path: '',
            loadComponent: () => import( '../carousels/carousel-index-page/carousel-index-page.component' ).then((m) => m.CarouselIndexPageComponent),
            data: {
            title: 'Todas'
            }
        },

        {
            path: 'create',
            loadComponent: () => import('../carousels/carousel-create-page/carousel-create-page.component').then(m => m.CarouselCreatePageComponent),
            data: {
            title: 'Crear carousel'
            }
        },
        
        {
            path: ':carousel_id',
            loadComponent: () => import('../carousels/carousel-edit-page/carousel-edit-page.component').then(m => m.CarouselEditPageComponent),
            data: {
            title: 'Editar'
            }
        },
    ]
  },
];
