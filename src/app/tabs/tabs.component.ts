import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ViewContainerRef,
  AfterViewInit,
  ComponentRef,
  TemplateRef,
  ElementRef, EnvironmentInjector, Inject, PLATFORM_ID, DestroyRef,
} from '@angular/core';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {TabInstance, TabsService} from './tabs.service';
import {isPlatformBrowser, NgForOf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  imports: [
    NgForOf,
    MatButtonModule,
    MatIconModule,
    DragDropModule
  ],
  standalone: true,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {
  tabs: TabInstance[] = [];


  // anchors for each tab content. We'll keep these aligned with tabs[] via index.
  @ViewChildren('anchor', {read: ViewContainerRef}) anchors!: QueryList<ViewContainerRef>;


  activeIndex = 0;


  constructor(
    public tabsSvc: TabsService,
    private rootEnv: EnvironmentInjector,
    private destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) private platformId: typeof PLATFORM_ID
  ) {
  }


  ngOnInit() {
    const isBrowser = isPlatformBrowser(this.platformId)
    console.log(isBrowser)
    if(isBrowser){
      this.tabsSvc.restoreTabs();
    }
    this.tabsSvc.activeIndex$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.activeIndex = res
    })
    // this.tabs = this.tabsSvc.tabs;
  }

  getActiveIndex(i: number){
    this.tabsSvc.setActiveIndex(i)
  }


  ngAfterViewInit() {
    // When anchors change (e.g. new tab added) try to create component if missing
    this.anchors.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.instantiateMissing());

    // initial instantiate
    // setTimeout(() => this.instantiateMissing());
  }


  private async instantiateMissing() {
    // Align anchors with tabs by index
    const anchors = this.anchors.toArray();
    for (let i = 0; i < this.tabsSvc.tabs.length; i++) {
      const tab = this.tabsSvc.tabs[i];
      const anchor = anchors[i];
      if (!anchor) continue;
      if (!tab.componentRef) {
        // lazy-load the component class
        const compType = await tab.loader();
        const injector = tab.injector ?? this.rootEnv;
        tab.componentRef = anchor.createComponent(compType, { environmentInjector: injector });
        // You can pass inputs to compRef.instance here if needed
      }
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    this.tabsSvc.moveTab(event.previousIndex, event.currentIndex);
    this.activeIndex = event.currentIndex;
  }


  close(tab: TabInstance, index: number) {
    const wasActive = this.activeIndex === index;
    this.tabsSvc.closeTab(tab);
  }

  ngOnDestroy() {
    // ensure all components destroyed if container destroyed
    for (const t of this.tabs) t.componentRef?.destroy();
  }
}
