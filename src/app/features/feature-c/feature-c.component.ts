import { Component } from '@angular/core';

@Component({
  selector: 'app-feature-c',
  standalone: true,
  imports: [],
  templateUrl: './feature-c.component.html',
  styleUrl: './feature-c.component.scss'
})
export class FeatureCComponent {

  ngOnDestroy() {
    console.log('FeatureCComponent Destroyed')
  }
}
