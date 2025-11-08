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
  ElementRef, EnvironmentInjector,
} from '@angular/core';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {TabInstance, TabsService} from './tabs.service';
import {NgForOf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


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


  constructor(public tabsSvc: TabsService, private rootEnv: EnvironmentInjector) {
  }


  ngOnInit() {
    // this.tabs = this.tabsSvc.tabs;
  }


  ngAfterViewInit() {
    // When anchors change (e.g. new tab added) try to create component if missing
    this.anchors.changes.subscribe(() => this.instantiateMissing());
    // initial instantiate
    setTimeout(() => this.instantiateMissing());
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
