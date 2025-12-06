import {Injectable, Type} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

export interface TabInfo {
  key: string; // feature key
  title: string;
  component: any;
  route: string;
  isDetail: boolean;
  data: any;
}

export interface activeTabs {
  tabKey: any;
  path: string;
  component: Type<any>;
}

@Injectable({providedIn: 'root'})
export class TabsStateService {
  tabs$: BehaviorSubject<TabInfo[]> = new BehaviorSubject<TabInfo[]>([]);
  tabData$: BehaviorSubject<TabInfo | null> = new BehaviorSubject<TabInfo | null>(null);
  activeIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  activeComponents$: BehaviorSubject<activeTabs[]> = new BehaviorSubject<activeTabs[]>([]);
  isRemovingTab: boolean = false

  constructor(private router: Router) {
  }

  async openTab(data: {
    key: string,
    title: string,
    component: any,
    route: string,
    isDetail: boolean,
    data: any
  }) {
    if (!this.isRemovingTab) {
      const existing = this.tabs$.getValue().find((t) => t.key === data.key);
      if (!existing) {
        let tabs = this.tabs$.getValue();
        tabs.push({
          key: data.key,
          title: data.title,
          component: data.component,
          route: data.route,
          isDetail: data.isDetail,
          data: data.data
        });
        this.tabs$.next(tabs);
        this.activeIndex$.next(tabs.length - 1);
      } else {
        this.activeIndex$.next(this.tabs$.getValue().indexOf(existing));
      }
    } else {
      this.isRemovingTab = false
      return
    }
  }

  async syncRouter(route: string) {
    await this.router.navigate([route]);
  }

  closeTab(itemIndex: number) {
    this.isRemovingTab = true
    let tabs = this.tabs$.getValue();
    let canChangeRoute: boolean = this.changeRoute(itemIndex)
    this.tabs$.next(tabs.filter((item, index) => index !== itemIndex));
    if (canChangeRoute) {
      this.syncRouter(this.tabs$.getValue()[itemIndex].route)
    }
  }

  changeRoute(itemIndex: number): boolean {
    return this.activeIndex$.getValue() === itemIndex && this.tabs$.getValue().length > 0 && this.tabs$.getValue().length - 1 > itemIndex
  }
}
