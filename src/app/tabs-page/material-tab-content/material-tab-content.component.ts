import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

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
  @Input() componentType!: Type<any>;
  @Input() componentData: any;

  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        console.log(res);
        // this.title = res
      });
  }

  ngAfterViewInit() {
    console.log(this.componentData);
    if (this.componentType) {
      const compRef = this.container.createComponent(this.componentType);
      if (this.componentData) {
        console.log(compRef);
        console.log(compRef.instance);
        compRef.instance.data = this.componentData;
        // Object.assign(compRef.instance.data, this.componentData);
      }
    }
  }
}
