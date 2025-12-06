import {Component, inject, OnInit, Type} from '@angular/core';
import {ActivationEnd, NavigationEnd, NavigationSkipped, Router, RouterOutlet} from '@angular/router';
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
    let component: Type<Component> | null = null
    this.router.events.subscribe((res) => {
      if (res instanceof ActivationEnd) {
        if (!res.snapshot.firstChild) {
          component = res?.snapshot?.component
        }
      } else if (res instanceof NavigationEnd) {
        this.handleOpenTab(res, component)
      }
    });
  }

  handleOpenTab(res: any, component: Type<Component> | null) {
    let data: TabInfo = JSON.parse(JSON.stringify(this.tabsStateService.tabData$.getValue()))
    this.createTab(component, res.url, data)
  }

  createTab(component: Type<Component> | null, url: string, data: TabInfo) {
    this.menuItems.forEach(item => {
      if (item.route === url && url.length <= item.route.length) {
        this.openTab(item, component)
        return
      } else if (item.children.length) {
        item.children.forEach(child => {
          if (url.includes(child.route)) {
            let clonedChild = JSON.parse(JSON.stringify(child))
            clonedChild = this.createTabData({clonedChild, url, child, data})
            this.openTab(clonedChild, component)
          }
        })
      }
    })
  }

  createTabData(args: {clonedChild: MENU_ITEM_INTERFACE, url: string, child: MENU_ITEM_INTERFACE, data: TabInfo}){
    let split = args.url.split(args.child.route)
    if (args.data?.data) {
      args.clonedChild.data = args.data.data
    } else {
      const key: string = args.child.param!
      args.clonedChild.data = {
        [key]: split[1]
      }
    }
    args.clonedChild.isDetail = args.data.isDetail ? args.data.isDetail : split.length > 1;
    args.clonedChild.key = args.url
    args.clonedChild.route = args.url
    args.clonedChild.title = args.data.title ? args.data.title : (args.child.title + ' ' + split[1]);
    return args.clonedChild
  }

  openTab(item: MENU_ITEM_INTERFACE, component: any) {
    item.component = component
    this.tabsStateService.openTab(item)
  }
}
