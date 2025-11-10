import {
  Component,
  DestroyRef,
  Inject,
  inject,
  Injector,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { TabInfo, TabsStateService } from './tabs-state.service';
import { MaterialTabContentComponent } from './material-tab-content/material-tab-content.component';
import { FeatureAComponent } from '../features/feature-a/feature-a.component';
import { FeatureBComponent } from '../features/feature-b/feature-b.component';
import { FeatureCComponent } from '../features/feature-c/feature-c.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tabs-page',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    NgForOf,
    RouterOutlet,
    NgIf,
    MaterialTabContentComponent,
    FeatureBComponent,
  ],
  templateUrl: './tabs-page.component.html',
  styleUrl: './tabs-page.component.scss',
})
export class TabsPageComponent implements OnInit {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  destroyRef: DestroyRef = inject(DestroyRef);
  activeIndex: number = -1;
  tabs: TabInfo[] = [];

  constructor(
    public tabsSvc: TabsStateService,
    @Inject(Injector) private injector: any,
    private contexts: ChildrenOutletContexts
  ) {}

  ngOnInit() {
    if (this.isBrowser) {
      // this.tabsSvc.loadState();
      // this.tabsSvc.syncRouter();
      this.tabsSvc.tabs$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          console.log(res);
          this.tabs = res;
        });
      this.tabsSvc.activeIndex$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          this.activeIndex = res;
        });
    }
  }

  async open(key: string, title: string, component: any, route: string) {
    await this.tabsSvc.openTab(key, title, component, route, false, {});
  }

  closeTab(index: number) {
    // const tab = this.tabsSvc.tabs[index];
    // const outlet = tab.outlet;
    //
    // const ctx = this.contexts.getContext(outlet);
    // console.log(ctx)
    // const componentInstance = ctx?.outlet?.component as any;
    // console.log(componentInstance)
    // if (componentInstance && 'canDeactivate' in componentInstance) {
    //   const guard = this.injector.get(UnsavedChangesGuard);
    //   const result = await firstValueFrom(guard.canDeactivate(componentInstance));
    //   if (!result) return; // cancel close
    // }

    this.tabsSvc.closeTab(index, this.activeIndex);
  }

  onActiveChange(index: number) {
    console.log(index);
    this.tabsSvc.activeIndex$.next(index);
    let route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsSvc.saveState();
    this.tabsSvc.syncRouter(route);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    // update activeIndex if needed
    if (this.activeIndex === event.previousIndex) {
      this.tabsSvc.activeIndex$.next(event.currentIndex);
    } else if (
      this.activeIndex > Math.min(event.previousIndex, event.currentIndex) &&
      this.activeIndex <= Math.max(event.previousIndex, event.currentIndex)
    ) {
      this.tabsSvc.activeIndex$.next(
        event.previousIndex < event.currentIndex
          ? this.tabsSvc.activeIndex$.getValue() - 1
          : this.tabsSvc.activeIndex$.getValue() + 1
      );
    }
    this.tabsSvc.saveState();
  }

  getSelectedTab(event: MatTabChangeEvent) {
    console.log(event);
  }

  protected readonly FeatureAComponent = FeatureAComponent;
  protected readonly FeatureBComponent = FeatureBComponent;
  protected readonly FeatureCComponent = FeatureCComponent;
}
