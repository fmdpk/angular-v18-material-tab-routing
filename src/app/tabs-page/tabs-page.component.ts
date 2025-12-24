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
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {TabInfo, TabsStateService} from './tabs-state.service';
import {MaterialTabContentComponent} from './material-tab-content/material-tab-content.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {firstValueFrom} from 'rxjs';
import {BidiModule} from '@angular/cdk/bidi';

@Component({
  selector: 'app-tabs-page',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    MaterialTabContentComponent,
    BidiModule,
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
  direction: 'rtl' | 'ltr' = 'rtl'
  dragClientY: number = 0
  dynamicTabIndex = 'dynamictabindex'

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
        setTimeout(() => {
          this.modifyTabElements()
        })
      });
  }

  modifyTabElements() {
    let elements: NodeListOf<Element> = document.querySelectorAll('.mdc-tab')
    elements.forEach((item: Element) => {
      let list: NodeListOf<Element> = item.querySelectorAll('.custom-mat-tab-header-wrapper')
      if (list) {
        const index = list[0].attributes.getNamedItem(`data-${this.dynamicTabIndex}`)?.value
        item.setAttribute(`data-${this.dynamicTabIndex}`, index!)
      }
    })
  }

  syncActiveIndex() {
    this.tabsStateService.activeIndex$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.activeIndex = res;
      });
  }

  open(title: string, route: string) {
    this.tabsStateService.tabData$.next({
      key: title,
      title,
      component: null,
      route,
      isDetail: false,
      data: {}
    })
    this.router.navigateByUrl(route)
  }

  async canCLoseTab(tab: TabInfo, index: number) {
    const foundTab = this.tabsStateService.activeComponents$.getValue().find(item => item.tabKey === tab.key);
    if (foundTab && foundTab.canDeactivateGuard) {
      const guard = this.injector.get(foundTab.canDeactivateGuard);
      const result = await firstValueFrom(guard.canDeactivate(foundTab?.component))
      if (result) {
        this.closeTab(index, tab.key)
      }
    } else {
      this.closeTab(index, tab.key)
    }
  }

  closeTab(index: number, key: string) {
    this.tabsStateService.closeTab(index, key);
  }

  onActiveChange(index: number) {
    let route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsStateService.syncRouter(route).then(res => {
      this.tabsStateService.activeIndex$.next(index);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    const targetIndex = this.tabs.length - 1 - event.currentIndex
    const sourceIndex = +event.item.element.nativeElement.dataset[this.dynamicTabIndex]!;
    if ((targetIndex === sourceIndex) || targetIndex < 0 || sourceIndex < 0) return;
    moveItemInArray(this.tabs, sourceIndex, targetIndex);
    this.tabsStateService.tabs$.next(this.tabs)
    if (this.activeIndex === sourceIndex) {
      this.tabsStateService.activeIndex$.next(targetIndex);
    } else if (
      this.activeIndex > Math.min(sourceIndex, targetIndex) &&
      this.activeIndex <= Math.max(sourceIndex, targetIndex)
    ) {
      this.tabsStateService.activeIndex$.next(
        sourceIndex < targetIndex
          ? this.tabsStateService.activeIndex$.getValue() - 1
          : this.tabsStateService.activeIndex$.getValue() + 1
      );
    }
  }

  getStart(event: any) {
    this.dragClientY = event.event.clientY
  }
}
