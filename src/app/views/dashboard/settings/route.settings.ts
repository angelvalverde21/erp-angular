import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( './setting-page/setting-page.component' ).then((m) => m.SettingPageComponent),
        data: {
          title: 'Setting Page'
        }
      }
    ]
  },
];
