import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs-page/tabs-page.component').then(
        (m) => m.TabsPageComponent
      ),
    children: [
      {
        path: 'feature-a',
        loadComponent: () =>
          import('./features/feature-a/feature-a.component').then(
            (m) => m.FeatureAComponent
          ),
      },
      {
        path: 'feature-b',
        loadComponent: () =>
          import('./features/feature-b/feature-b.component').then(
            (m) => m.FeatureBComponent
          ),
      },
      {
        path: 'feature-b/:title',
        loadComponent: () =>
          import(
            './features/feature-b/feature-b-details/feature-b-details.component'
          ).then((m) => m.FeatureBDetailsComponent),
      },
      {
        path: 'feature-c',
        loadComponent: () =>
          import('./features/feature-c/feature-c.component').then(
            (m) => m.FeatureCComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: '/tabs', pathMatch: 'full' },
];
