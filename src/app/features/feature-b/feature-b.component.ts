import {Component, inject} from '@angular/core';
import {GlobalService} from '../../core/services/global.service';

@Component({
  selector: 'app-feature-b',
  standalone: true,
  imports: [],
  templateUrl: './feature-b.component.html',
  styleUrl: './feature-b.component.scss'
})
export class FeatureBComponent {
  globalService = inject(GlobalService)

  ngOnInit(){
    console.log('Service instance ID', this.globalService)
    this.globalService.counter++
  }
}
