import { Component, inject } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { FeatureBDetailsComponent } from './feature-b-details/feature-b-details.component';
import { TabInfo, TabsStateService } from '../../tabs-page/tabs-state.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-feature-b',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './feature-b.component.html',
  styleUrl: './feature-b.component.scss',
})
export class FeatureBComponent {
  globalService = inject(GlobalService);
  tabsStateService = inject(TabsStateService);
  router = inject(Router);
  list: TabInfo[] = [
    {
      key: 'item 1',
      title: 'Item 1',
      route: '/tabs/feature-b/1',
      component: FeatureBDetailsComponent,
      isDetail: true,
      data: {},
    },
    {
      key: 'item 2',
      title: 'item 2',
      route: '/tabs/feature-b/2',
      component: FeatureBDetailsComponent,
      isDetail: true,
      data: {},
    },
  ];

  ngOnInit() {
    console.log('Service instance ID', this.globalService);
    this.globalService.counter++;
  }

  async goToDetail(item: TabInfo, index: number) {
    await this.tabsStateService.openTab(
      item.key,
      item.title,
      item.component,
      item.route,
      item.isDetail,
      { title: index + 1 }
    );
    // this.router.navigate(['/tabs/feature-b', index])
  }

  ngOnDestroy() {
    console.log('FeatureBComponent Destroyed');
  }
}
