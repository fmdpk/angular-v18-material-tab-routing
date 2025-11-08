import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FeatureRegistryService } from './feature-registry.service';
import {AuthService} from './auth/auth.service';

export const featureGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const registry = inject(FeatureRegistryService);
  const key = route.routeConfig?.path ?? '';
  const feature = registry.find(key);

  if (!feature) return false;

  const roles = auth.currentUserRoles();

  if (feature.canActivate && !feature.canActivate(roles)) {
    console.warn(`Access denied: ${key}`);
    return false;
  }

  if (feature.requiredRoles && !feature.requiredRoles.some(r => roles.includes(r))) {
    console.warn(`Missing roles for: ${key}`);
    return false;
  }

  return true;
};
