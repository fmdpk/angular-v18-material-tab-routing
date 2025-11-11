import {Component, inject, Type} from '@angular/core';
import {ActivationEnd, ActivationStart, NavigationEnd, NavigationSkipped, Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TabsPageComponent} from './tabs-page/tabs-page.component';
import {TabInfo, TabsStateService} from './tabs-page/tabs-state.service';

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
export class AppComponent {
  title = 'angular-v18-material-tab-routing';
  router = inject(Router);
  tabsStateService = inject(TabsStateService);

  ngOnInit() {
    let component: Type<any> | null = null
    this.router.events.subscribe( (res) => {
      if (res instanceof ActivationEnd) {
        if(!res.snapshot.firstChild){
          component = res?.snapshot?.component
          const componentInstance = res?.snapshot?.component;
          console.log('Activated route component type:', componentInstance);
        }
      } else if (res instanceof NavigationEnd) {
        let data: TabInfo = JSON.parse(JSON.stringify(this.tabsStateService.tabData$.getValue()))
        if (data && !this.tabsStateService.preventOpenTab$.getValue()) {
          data.component = component
          this.tabsStateService.openTab(data)
        } else if(this.tabsStateService.preventOpenTab$.getValue()){
          this.tabsStateService.preventOpenTab$.next(false)
        }
      }
    });
  }
}
