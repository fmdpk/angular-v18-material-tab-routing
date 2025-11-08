import {FeatureEntry} from '../../core/feature-token';
import {FEATURE_B_PROVIDERS} from './feature-b.providers';

export const FeatureBEntry: FeatureEntry = {
  key: 'feature-b',
  title: 'Feature B',
  loader: () => import('./feature-b.component').then(m => m.FeatureBComponent),
  providers: FEATURE_B_PROVIDERS,
  requiredRoles: ['admin', 'power-user'],
  // canActivate: (roles) => roles.includes('admin'),
  canActivate: async (roles) => {

    // If you have API call to check access
    // const resp = await fetch('/api/check-access?feature=feature-b');
    // const {allowed} = await resp.json();

    return roles.includes('admin');
  },
};
