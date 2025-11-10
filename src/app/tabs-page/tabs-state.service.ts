import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface TabInfo {
  key: string; // feature key
  title: string;
  component: any; // router outlet name
  route: string;
  isDetail: boolean;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class TabsStateService {
  tabs$: BehaviorSubject<TabInfo[]> = new BehaviorSubject<TabInfo[]>([]);
  activeIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private readonly STORAGE_KEY = 'app:mat-tabs-state';

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
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({
        tabs: this.tabs$.getValue(),
        activeIndex: this.activeIndex$.getValue(),
      })
    );
  }

  async openTab(
    key: string,
    title: string,
    component: any,
    route: string,
    isDetail: boolean = false,
    data: any
  ) {
    const existing = this.tabs$.getValue().find((t) => t.key === key);
    if (!existing) {
      let tabs = this.tabs$.getValue();
      tabs.push({ key, title, component, route, isDetail, data });
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
