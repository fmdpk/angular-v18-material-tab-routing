import { FeatureEntry } from '../../core/feature-token';
import { FEATURE_A_PROVIDERS } from './feature-a.providers';

export const FeatureAEntry: FeatureEntry = {
  key: 'feature-a',
  title: 'Feature A',
  loader: () => import('./feature-a.component').then(m => m.FeatureAComponent),
  providers: FEATURE_A_PROVIDERS,
  requiredRoles: ['admin', 'power-user'],
  canActivate: (roles) => roles.includes('admin'),
};
