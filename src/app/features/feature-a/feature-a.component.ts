import {Component, inject, OnInit, signal} from '@angular/core';
import {FeatureAService} from '../../core/services/feature-a.service';

@Component({
  selector: 'app-feature-a',
  standalone: true,
  imports: [],
  templateUrl: './feature-a.component.html',
  styleUrl: './feature-a.component.scss'
})
export class FeatureAComponent implements OnInit{
  title = signal('feature-a')
  svc = inject(FeatureAService);

  ngOnInit() {
    console.log('Service instance ID', this.svc)
    console.log(this.svc.counter++)
    setTimeout(() => {
      this.title.set('feature-a after 2 sec')
    }, 2000)
  }
}
