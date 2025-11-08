import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {FeatureAService} from '../../core/services/feature-a.service';

export const FEATURE_A_PROVIDERS: EnvironmentProviders[] = [
  // makeEnvironmentProviders([{ provide: FeatureAService, useClass: FeatureAService }]),
  makeEnvironmentProviders([]),
];
