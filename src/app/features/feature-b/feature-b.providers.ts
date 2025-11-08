import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {FeatureBService} from '../../core/services/feature-b.service';

export const FEATURE_B_PROVIDERS: EnvironmentProviders[] = [
  makeEnvironmentProviders([{ provide: FeatureBService, useClass: FeatureBService }]),
];
