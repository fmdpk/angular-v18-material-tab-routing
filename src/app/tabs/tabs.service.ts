import {
  Injectable,
  ComponentRef,
  Type,
  EnvironmentInjector,
  createEnvironmentInjector,
} from '@angular/core';
import {FeatureRegistryService} from '../core/feature-registry.service';
import {BehaviorSubject} from 'rxjs';

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
  activeIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly STORAGE_KEY = 'openTabsState';

  constructor(private featureRegistry: FeatureRegistryService, private rootEnv: EnvironmentInjector) {

  }

  private persistTabs() {
    const data = {
      activeIndex: this.activeIndex$.getValue(),
      tabs: this.tabs.map(t => ({ id: t.id, key: t.key, title: t.title })),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async restoreTabs() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return;

    try {
      const { tabs, activeIndex } = JSON.parse(saved);
      for (const t of tabs) {
        const restored = await this.openFeature(t.key, ['admin'],false);
        restored.id = t.id;
        restored.title = t.title;
      }
      console.log(tabs)
      this.activeIndex$.next(activeIndex ?? 0)
    } catch (err) {
      console.warn('Failed to restore tabs:', err);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  async openFeature(key: string, userRoles: string[] = [], persist = true): Promise<TabInstance> {
    const existing = this.tabs.find(t => t.key === key);
    console.log(existing)
    if (existing) {
      this.activeIndex$.next(this.tabs.indexOf(existing))
      if (persist) this.persistTabs();
      return existing;
    };

    const feature = this.featureRegistry.find(key);
    console.log(feature)
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
    console.log(tab)

    this.tabs.push(tab);
    this.activeIndex$.next(this.tabs.length - 1)

    if (persist) this.persistTabs();


    return tab;
  }

  closeTab(tab: TabInstance) {
    tab.componentRef?.destroy();
    tab.injector?.destroy();
    const idx = this.tabs.indexOf(tab);
    this.tabs.splice(idx, 1);

    // Adjust active index safely
    if (this.activeIndex$.getValue() >= this.tabs.length) {
      this.activeIndex$.next(Math.max(0, this.tabs.length - 1))
    }

    this.persistTabs();
  }

  moveTab(previousIndex: number, currentIndex: number) {
    if (previousIndex === currentIndex) return;
    const tab = this.tabs.splice(previousIndex, 1)[0];
    this.tabs.splice(currentIndex, 0, tab);
  }

  setActiveIndex(index: number) {
    this.activeIndex$.next(index)
    this.persistTabs();
  }
}
