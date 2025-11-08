import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {FEATURE_REGISTRY} from './core/feature-token';
import {FeatureAEntry} from './features/feature-a/feature-a.entry';
import {FeatureBEntry} from './features/feature-b/feature-b.entry';
import {FeatureCEntry} from './features/feature-c/feature-c.entry';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: FEATURE_REGISTRY, useValue: [FeatureAEntry, FeatureBEntry, FeatureCEntry], multi: true }
  ]
};
