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
import {ActivatedRoute, Router} from '@angular/router';

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
  activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  router: Router = inject(Router)
  @Input() componentType!: Type<any>;
  @Input() componentData: any;
  @Input() tabKey: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.componentType) {
      const compRef = this.container.createComponent(this.componentType);
      let activeComps = this.tabsStateService.activeComponents$.getValue()
      activeComps.push({
        tabKey: this.tabKey,
        path: this.router.url,
        component: compRef.instance,
        canDeactivateGuard: this.getDeactivateGuard()
      })
      this.tabsStateService.activeComponents$.next(activeComps)
      if (this.componentData) {
        compRef.instance.data = this.componentData;
      }
    }
  }

  getDeactivateGuard() {
    let canDeactivateGuard = null;
    let current = this.activatedRoute.snapshot;
    while (current.firstChild) {
      current = current.firstChild;
      if (current && !current.firstChild && current.routeConfig!.canDeactivate) {
        canDeactivateGuard = current.routeConfig!.canDeactivate[0];
      }
    }
    return canDeactivateGuard;
  }
}
