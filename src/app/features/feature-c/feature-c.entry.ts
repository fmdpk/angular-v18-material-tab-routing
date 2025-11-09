import { FeatureEntry } from '../../core/feature-token';
import { FEATURE_C_PROVIDERS } from './feature-c.providers';

export const FeatureCEntry: FeatureEntry = {
  key: 'feature-c',
  title: 'Feature C',
  loader: () => import('./feature-c.component').then(m => m.FeatureCComponent),
  providers: FEATURE_C_PROVIDERS,
  requiredRoles: ['admin', 'power-user'],
  canActivate: (roles) => roles.includes('admin'),
  // enabled: async () => {
  //   const config = await fetch('/api/feature-flags').then(r => r.json());
  //   return config['feature-c-enabled'] === true;
  // },
};
