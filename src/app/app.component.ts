import {Component, inject, OnInit, Type} from '@angular/core';
import {ActivationEnd, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TabInfo, TabsStateService} from './tabs-page/tabs-state.service';
import {MENU_ITEM_INTERFACE, MENU_ITEMS} from './core/data/menu-items';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-v18-material-tab-routing';
  router = inject(Router);
  tabsStateService = inject(TabsStateService);
  menuItems: MENU_ITEM_INTERFACE[] = JSON.parse(JSON.stringify(MENU_ITEMS))

  ngOnInit() {
    let component: Type<any> | null = null
    this.router.events.subscribe((res) => {
      if (res instanceof ActivationEnd) {
        if (!res.snapshot.firstChild) {
          component = res?.snapshot?.component
        }
      } else if (res instanceof NavigationEnd) {
        let data: TabInfo = JSON.parse(JSON.stringify(this.tabsStateService.tabData$.getValue()))
        if (data && !this.tabsStateService.preventOpenTab$.getValue()) {
          data.component = component
          this.tabsStateService.openTab(data)
        } else if (!data && !this.tabsStateService.preventOpenTab$.getValue()) {
          this.createTabOnPageLoad(component, res.url)
        } else if (this.tabsStateService.preventOpenTab$.getValue()) {
          this.tabsStateService.preventOpenTab$.next(false)
        }
      }
    });
  }

  createTabOnPageLoad(component: any, url: string) {
    this.menuItems.forEach(item => {
      if (item.route.includes(url) && url.length <= item.route.length) {
        this.openTab(item, component)
        return
      } else if (item.children.length) {
        item.children.forEach(child => {
          if (url.includes(child.route)) {
            let split = url.split(child.route)
            const key: string = child.param!
            child.data = {
              [key]: split[1]
            }
            child.key = child.key + '-' + split[1]
            child.title = child.title + ' ' + split[1]
            this.openTab(child, component)
          }
        })
      }
    })
  }

  openTab(item: MENU_ITEM_INTERFACE, component: any) {
    item.component = component
    this.tabsStateService.openTab(item)
  }
}
