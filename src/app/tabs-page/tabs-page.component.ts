import {
  Component,
  DestroyRef,
  Inject,
  inject,
  Injector,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {TabInfo, TabsStateService} from './tabs-state.service';
import {MaterialTabContentComponent} from './material-tab-content/material-tab-content.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {firstValueFrom} from 'rxjs';
import {UnsavedChangesGuard} from '../guards/unsaved-changes.guard';

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
  ],
  templateUrl: './tabs-page.component.html',
  styleUrl: './tabs-page.component.scss',
})
export class TabsPageComponent implements OnInit {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  destroyRef: DestroyRef = inject(DestroyRef);
  router: Router = inject(Router);
  activeIndex: number = -1;
  tabs: TabInfo[] = [];

  constructor(
    public tabsStateService: TabsStateService,
    @Inject(Injector) private injector: any,
  ) {
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.syncTabs()
      this.syncActiveIndex()
    }
  }

  syncTabs() {
    this.tabsStateService.tabs$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.tabs = res;
      });
  }

  syncActiveIndex() {
    this.tabsStateService.activeIndex$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.activeIndex = res;
      });
  }

  open(key: string, title: string, route: string) {
    this.tabsStateService.tabData$.next({
      key,
      title,
      component: null,
      route,
      isDetail: false,
      data: {}
    })
    this.tabsStateService.preventOpenTab$.next(false)
    this.router.navigateByUrl(route)
  }

  async canCLoseTab(tab: TabInfo, index: number) {
    let foundTab = this.tabsStateService.activeComponents$.getValue().find(item => item.tabKey === tab.key)
    if ('canDeactivate' in foundTab?.component!) {
      const guard = this.injector.get(UnsavedChangesGuard);
      const result = await firstValueFrom(guard.canDeactivate(foundTab?.component))
      if (result) {
        this.closeTab(index)
      }
    } else {
      this.closeTab(index)
    }
  }

  closeTab(index: number) {
    this.tabsStateService.preventOpenTab$.next(true)
    this.tabsStateService.closeTab(index);
  }

  onActiveChange(index: number) {
    let route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsStateService.preventOpenTab$.next(true)
    this.tabsStateService.syncRouter(route).then(res => {
      this.tabsStateService.activeIndex$.next(index);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    if (this.activeIndex === event.previousIndex) {
      this.tabsStateService.activeIndex$.next(event.currentIndex);
    } else if (
      this.activeIndex > Math.min(event.previousIndex, event.currentIndex) &&
      this.activeIndex <= Math.max(event.previousIndex, event.currentIndex)
    ) {
      this.tabsStateService.activeIndex$.next(
        event.previousIndex < event.currentIndex
          ? this.tabsStateService.activeIndex$.getValue() - 1
          : this.tabsStateService.activeIndex$.getValue() + 1
      );
    }
  }
}
