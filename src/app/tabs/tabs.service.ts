// import { Injectable, ComponentRef, Type } from '@angular/core';
//
//
// export interface AppTab {
//   id: string; // unique
//   title: string;
//   key: string; // logical route / key
// // loader returns the Component class (type) for the tab content
//   loader: () => Promise<Type<any>>;
// // created component instance (attached to DOM) — created when opened
//   componentRef?: ComponentRef<any>;
// }
//
//
// @Injectable({ providedIn: 'root' })
// export class TabsService {
//   tabs: AppTab[] = [];
//
//
//   // registry maps logical keys to lazy loaders
//   private registry: Record<string, () => Promise<Type<any>>> = {
//     'feature-a': () => import('../features/feature-a/feature-a.component').then(m => m.FeatureAComponent),
//     'feature-b': () => import('../features/feature-b/feature-b.component').then(m => m.FeatureBComponent),
//     'feature-c': () => import('../features/feature-c/feature-c.component').then(m => m.FeatureCComponent),
//   };
//
//
//   openByKey(key: string) {
//     const existing = this.tabs.find(t => t.key === key);
//     if (existing) return existing;
//
//
//     const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
//     const loader = this.registry[key];
//     if (!loader) throw new Error('No loader for key ' + key);
//
//
//     const tab: AppTab = {
//       id,
//       title: this.makeTitleFromKey(key),
//       key,
//       loader,
//     };
//
//
//     this.tabs.push(tab);
//     return tab;
//   }
//
//
//   closeTab(tabId: string) {
//     const idx = this.tabs.findIndex(t => t.id === tabId);
//     if (idx === -1) return;
//     const tab = this.tabs[idx];
// // destroy the created component if present
//     try {
//       tab.componentRef?.destroy();
//     } catch (e) {
// // swallow
//     }
//     this.tabs.splice(idx, 1);
//   }
//
//
//   moveTab(previousIndex: number, currentIndex: number) {
//     if (previousIndex === currentIndex) return;
//     const tab = this.tabs.splice(previousIndex, 1)[0];
//     this.tabs.splice(currentIndex, 0, tab);
//   }
//
//
//   private makeTitleFromKey(key: string) {
//     return key.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
//   }
// }


import {
  Injectable,
  ComponentRef,
  Type,
  EnvironmentInjector,
  createEnvironmentInjector,
} from '@angular/core';
import {FeatureRegistryService} from '../core/feature-registry.service';

export interface TabInstance {
  id: string;
  key: string;
  title: string;
  loader: () => Promise<Type<any>>;
  componentRef?: ComponentRef<any>;
  injector?: EnvironmentInjector;
}

@Injectable({providedIn: 'root'})
export class TabsService {
  tabs: TabInstance[] = [];

  constructor(private featureRegistry: FeatureRegistryService, private rootEnv: EnvironmentInjector) {
  }

  async openFeature(key: string, userRoles: string[] = []): Promise<TabInstance> {
    const existing = this.tabs.find(t => t.key === key);
    if (existing) return existing;

    const feature = this.featureRegistry.find(key);
    if (!feature) throw new Error(`Unknown feature: ${key}`);

    // Permission check
    if (feature.canActivate && !(await feature.canActivate(userRoles))) {
      throw new Error(`Access denied for feature: ${key}`);
    }

    // Async Permission check
    // if (feature.canActivate) {
    //   const allowed = await feature.canActivate(userRoles);
    //   if (!allowed) throw new Error(`Access denied for ${key}`);
    // }

    if (feature.requiredRoles && !feature.requiredRoles.some(r => userRoles.includes(r))) {
      throw new Error(`User lacks required role(s) for feature: ${key}`);
    }

    const id = crypto.randomUUID();

    const tab: TabInstance = {
      id,
      key,
      title: feature.title,
      loader: feature.loader,
    };

    // Create a custom EnvironmentInjector with feature-specific providers
    if (feature.providers) {
      tab.injector = createEnvironmentInjector(feature.providers, this.rootEnv);
    }

    this.tabs.push(tab);
    return tab;
  }

  closeTab(tab: TabInstance) {
    tab.componentRef?.destroy();
    tab.injector?.destroy();
    this.tabs = this.tabs.filter(t => t.id !== tab.id);
  }

  moveTab(previousIndex: number, currentIndex: number) {
    if (previousIndex === currentIndex) return;
    const tab = this.tabs.splice(previousIndex, 1)[0];
    this.tabs.splice(currentIndex, 0, tab);
  }
}
