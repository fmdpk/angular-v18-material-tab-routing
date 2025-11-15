import {Component, OnDestroy, OnInit, signal} from '@angular/core';
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
  styleUrl: './feature-a.component.scss',
  providers: [FeatureAService],
})
export class FeatureAComponent implements OnInit, CanDeactivateComponent, OnDestroy {
  title = signal('feature-a')
  formValue = '';
  savedValue = '';

  ngOnInit() {
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
