import { InjectionToken } from '@angular/core';
import { Type, EnvironmentProviders } from '@angular/core';

export interface FeatureEntry {
  key: string;
  title: string;
  loader: () => Promise<Type<any>>;
  providers?: EnvironmentProviders[];
  canActivate?: (roles: string[]) => boolean | Promise<boolean>;
  requiredRoles?: string[];
  enabled?: boolean | (() => boolean | Promise<boolean>);
}

export const FEATURE_REGISTRY = new InjectionToken<FeatureEntry[]>('FEATURE_REGISTRY');
