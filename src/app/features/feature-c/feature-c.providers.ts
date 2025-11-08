import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {FeatureCService} from '../../core/services/feature-c.service';

export const FEATURE_C_PROVIDERS: EnvironmentProviders[] = [
  makeEnvironmentProviders([{ provide: FeatureCService, useClass: FeatureCService }]),
];
