import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs-page/tabs-page.component').then((m) => m.TabsPageComponent),
    children: [
      {
        path: 'feature-a',
        outlet: 'a',
        loadComponent: () =>
          import('./features/feature-a/feature-a.component').then(
            (m) => m.FeatureAComponent
          ),
      },
      {
        path: 'feature-b',
        outlet: 'b',
        loadComponent: () =>
          import('./features/feature-b/feature-b.component').then(
            (m) => m.FeatureBComponent
          ),
      },
      {
        path: 'feature-c',
        outlet: 'c',
        loadComponent: () =>
          import('./features/feature-c/feature-c.component').then(
            (m) => m.FeatureCComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: '/tabs', pathMatch: 'full' },
];
