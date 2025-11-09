import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<CanDeactivateComponent> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(component: CanDeactivateComponent): Observable<boolean> {
    const result = component.canDeactivate();
    if (typeof result === 'boolean') {
      return result ? of(true) : this.confirm();
    }
    return result;
  }

  private confirm(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you really want to close this tab?',
      },
    });
    return dialogRef.afterClosed();
  }
}
