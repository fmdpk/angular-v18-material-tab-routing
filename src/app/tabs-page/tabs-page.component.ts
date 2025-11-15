import {
  Component,
  DestroyRef,
  Inject,
  inject,
  Injector,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
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
    public tabsSvc: TabsStateService,
    @Inject(Injector) private injector: any,
  ) {
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.tabsSvc.tabs$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          this.tabs = res;
        });
      this.tabsSvc.activeIndex$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          this.activeIndex = res;
        });
    }
  }

  open(key: string, title: string, component: any, route: string) {
    this.tabsSvc.tabData$.next({
      key,
      title,
      component,
      route,
      isDetail: false,
      data: {}
    })
    this.router.navigateByUrl(route)
  }

  async canCLoseTab(tab: TabInfo, index: number) {
    let foundTab = this.tabsSvc.activeComponents$.getValue().find(item => item.tabKey === tab.key)
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
    this.tabsSvc.preventOpenTab$.next(true)
    this.tabsSvc.closeTab(index);
  }

  async onActiveChange(index: number) {
    this.tabsSvc.activeIndex$.next(index);
    let route = this.tabs[index] ? this.tabs[index].route : '/';
    await this.tabsSvc.syncRouter(route);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
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
  }
}
