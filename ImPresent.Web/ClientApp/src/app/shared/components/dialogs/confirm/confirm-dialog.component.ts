import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialogInput } from 'src/app/shared/models/confirm-dialog-input';

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent{

  constructor(
    private readonly dialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly inputs: ConfirmDialogInput,
  ) { }

  confirm(): void {
    this.dialog.close(true);
  }

}
