import {Component, Inject, inject, Injector, OnInit, PLATFORM_ID} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import {ChildrenOutletContexts, RouterOutlet} from '@angular/router';
import {TabsStateService} from '../tabs-state.service';
import {UnsavedChangesGuard} from '../guards/unsaved-changes.guard';
import {firstValueFrom} from 'rxjs';

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
  ],
  templateUrl: './tabs-page.component.html',
  styleUrl: './tabs-page.component.scss'
})
export class TabsPageComponent implements OnInit{
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(public tabsSvc: TabsStateService, @Inject(Injector) private injector: any, private contexts: ChildrenOutletContexts) {}

  ngOnInit() {
    if(this.isBrowser){
      this.tabsSvc.loadState();
      this.tabsSvc.syncRouter();
    }
  }

  async open(key: string, title: string, outlet: string) {
    await this.tabsSvc.openTab(key, title, outlet);
  }

  async closeTab(index: number) {
    const tab = this.tabsSvc.tabs[index];
    const outlet = tab.outlet;

    const ctx = this.contexts.getContext(outlet);
    console.log(ctx)
    const componentInstance = ctx?.outlet?.component as any;
    console.log(componentInstance)
    if (componentInstance && 'canDeactivate' in componentInstance) {
      const guard = this.injector.get(UnsavedChangesGuard);
      const result = await firstValueFrom(guard.canDeactivate(componentInstance));
      if (!result) return; // cancel close
    }

    // If confirmed, remove tab
    this.tabsSvc.closeTab(index);
  }

  onActiveChange(index: number) {
    this.tabsSvc.activeIndex = index;
    this.tabsSvc.saveState();
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabsSvc.tabs, event.previousIndex, event.currentIndex);
    // update activeIndex if needed
    if (this.tabsSvc.activeIndex === event.previousIndex) {
      this.tabsSvc.activeIndex = event.currentIndex;
    } else if (
      this.tabsSvc.activeIndex > Math.min(event.previousIndex, event.currentIndex) &&
      this.tabsSvc.activeIndex <= Math.max(event.previousIndex, event.currentIndex)
    ) {
      this.tabsSvc.activeIndex += event.previousIndex < event.currentIndex ? -1 : 1;
    }
    this.tabsSvc.saveState();
  }
}
