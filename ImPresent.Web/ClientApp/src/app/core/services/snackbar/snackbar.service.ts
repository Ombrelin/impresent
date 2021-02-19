import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SnackBarConfig {
  action?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  show(message: string, config: SnackBarConfig = {
    action: undefined,
    duration: 2000
  }): void {
    this.snackBar.open(message, config.action, {
      duration: config.duration
    });
  }
}
