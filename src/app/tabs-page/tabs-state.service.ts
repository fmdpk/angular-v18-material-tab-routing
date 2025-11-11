import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

export interface TabInfo {
  key: string; // feature key
  title: string;
  component: any;
  route: string;
  isDetail: boolean;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class TabsStateService {
  tabs$: BehaviorSubject<TabInfo[]> = new BehaviorSubject<TabInfo[]>([]);
  tabData$: BehaviorSubject<TabInfo | null> = new BehaviorSubject<TabInfo | null>(null);
  preventOpenTab$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  activeIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private readonly STORAGE_KEY = 'app:mat-tabs-state';
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private router: Router) {}

  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      this.tabs$.next(parsed.tabs || []);
      this.activeIndex$.next(parsed.activeIndex ?? 0);
    } catch {
      this.tabs$.next([]);
      this.activeIndex$.next(0);
    }
  }

  saveState() {
    if(this.isBrowser){
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          tabs: this.tabs$.getValue(),
          activeIndex: this.activeIndex$.getValue(),
        })
      );
    }
  }

  async openTab(data: {
    key: string,
    title: string,
    component: any,
    route: string,
    isDetail: boolean,
    data: any
  }) {
    console.log(data)
    const existing = this.tabs$.getValue().find((t) => t.key === data.key);
    if (!existing) {
      let tabs = this.tabs$.getValue();
      tabs.push({ key: data.key, title: data.title, component: data.component, route: data.route, isDetail: data.isDetail, data: data.data });
      this.tabs$.next(tabs);
      this.activeIndex$.next(tabs.length - 1);
    } else {
      this.activeIndex$.next(this.tabs$.getValue().indexOf(existing));
    }

    // await this.syncRouter(route);
    this.saveState();
  }

  async syncRouter(route: string) {
    this.router.navigate([route]);
  }

  closeTab(itemIndex: number, activeIndex: number) {
    let tabs = this.tabs$.getValue();
    this.tabs$.next(tabs.filter((item, index) => index !== itemIndex));
  }
}
