import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  showLoading(): MatDialogRef<LoadingDialogComponent> {
    return this.dialog.open(LoadingDialogComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
  }
}
