import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FeatureAService} from '../../core/services/feature-a.service';
import {CanDeactivateComponent} from '../../guards/unsaved-changes.guard';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-feature-a',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './feature-a.component.html',
  styleUrl: './feature-a.component.scss'
})
export class FeatureAComponent implements OnInit, CanDeactivateComponent, OnDestroy {
  title = signal('feature-a')
  svc = inject(FeatureAService);
  formValue = '';
  savedValue = '';

  ngOnInit() {
    console.log('Service instance ID', this.svc)
    console.log(this.svc.counter++)
    setTimeout(() => {
      this.title.set('feature-a after 2 sec')
    }, 2000)
  }

  canDeactivate(): boolean {
    return this.formValue === this.savedValue; // false = unsaved changes
  }

  ngOnDestroy() {
    console.log('FeatureAComponent Destroyed')
  }
}
