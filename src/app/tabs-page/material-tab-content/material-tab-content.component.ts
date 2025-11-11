import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

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

  ngOnInit() {
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
