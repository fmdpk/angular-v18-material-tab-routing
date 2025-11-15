import {Component, inject, Input, OnInit} from '@angular/core';
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

  dialog = inject(MatDialog);
  titleStr: string = '';
  ngOnInit() {
    this.titleStr = this.data.title;
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
