import {Component, DestroyRef, inject, Input, NgZone, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feature-b-details',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './feature-b-details.component.html',
  styleUrl: './feature-b-details.component.scss',
})
export class FeatureBDetailsComponent implements OnInit {
  @Input('title') title: any;
  @Input('data') data: any;
  activatedRoute = inject(ActivatedRoute);
  ngZone = inject(NgZone);
  // activatedRouteSnapshot = inject(ActivatedRouteSnapshot);
  destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);
  titleStr: string = '';
  ngOnInit() {
    console.log(this.activatedRoute.snapshot.params['title']);
    // console.log(this.activatedRouteSnapshot.params);
    console.log(this.title);
    console.log(this.data);
    this.titleStr = this.data.title;
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        console.log(res);
        // this.titleStr = res.get('title')!;
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Unsaved Changes',
        message:
          'You have unsaved changes. Do you really want to close this tab?',
      },
    });
  }
}
