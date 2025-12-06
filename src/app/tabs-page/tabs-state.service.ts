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
  tabData$: BehaviorSubject<TabInfo | {}> = new BehaviorSubject<TabInfo | {}>({});
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
        this.tabData$.next({})
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

  async closeTab(itemIndex: number, key: string) {
    this.isRemovingTab = true
    let tabs = this.tabs$.getValue();
    let activeComponents = this.activeComponents$.getValue();
    let canChangeRoute: boolean = this.changeRoute(itemIndex)
    this.tabs$.next(tabs.filter((item, index) => index !== itemIndex));
    this.activeComponents$.next(activeComponents.filter(item => item.tabKey !== key))
    if (canChangeRoute) {
      await this.syncRouter(this.tabs$.getValue()[itemIndex].route)
    }
    this.isRemovingTab = false
  }

  changeRoute(itemIndex: number): boolean {
    return this.activeIndex$.getValue() === itemIndex && this.tabs$.getValue().length > 0 && this.tabs$.getValue().length - 1 > itemIndex
  }
}
