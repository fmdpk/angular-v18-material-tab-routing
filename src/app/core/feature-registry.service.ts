import {Inject, Injectable, Optional} from '@angular/core';
import {FEATURE_REGISTRY, FeatureEntry} from './feature-token';


@Injectable({
  providedIn: 'root'
})
export class FeatureRegistryService {

  constructor(@Optional() @Inject(FEATURE_REGISTRY) private features: FeatureEntry[][]) {}

  get all(): FeatureEntry[] {
    return (this.features ?? []).flat();
  }

  find(key: string): FeatureEntry | undefined {
    return this.all.find(f => f.key === key);
  }
}
