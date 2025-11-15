import {
  AfterViewInit,
  Component, inject,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {TabsStateService} from '../tabs-state.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';

@Component({
  selector: 'app-material-tab-content',
  standalone: true,
  imports: [],
  templateUrl: './material-tab-content.component.html',
  styleUrl: './material-tab-content.component.scss',
})
export class MaterialTabContentComponent implements AfterViewInit, OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  tabsStateService: TabsStateService = inject(TabsStateService)
  router: Router = inject(Router)
  @Input() componentType!: Type<any>;
  @Input() componentData: any;
  @Input() tabKey: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log(this.componentData);
    if (this.componentType) {
      const compRef = this.container.createComponent(this.componentType);
      console.log(this.router)
      let activeComps = this.tabsStateService.activeComponents$.getValue()
      activeComps.push({
        tabKey: this.tabKey,
        path: this.router.url,
        component: compRef.instance
      })
      this.tabsStateService.activeComponents$.next(activeComps)
      if (this.componentData) {
        // console.log(compRef);
        // console.log(compRef.instance);
        compRef.instance.data = this.componentData;
        // Object.assign(compRef.instance.data, this.componentData);
      }
    }
  }
}
