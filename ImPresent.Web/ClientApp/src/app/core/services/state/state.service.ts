import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiResponse } from 'ts-retrofit2';

import { PromotionDto } from 'src/app/shared/models/model';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';

export interface State<T> {
  data?: T;
  status?: number;
  snackbarError?: string;
  error?: string;
  success: boolean;
}

export const invalidPromotionId: State<PromotionDto> = {
  snackbarError: 'Invalid promotion id',
  success: false
};

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private readonly dialogService: DialogService,
  ) { }

  async fetch<T>(promise: ApiResponse<T>, loading = false): Promise<State<T>> {
    let loadingDialog: MatDialogRef<LoadingDialogComponent> | null = null;
    if (loading) {
      loadingDialog = this.dialogService.showLoading();
    }
    let snackbarError: string | undefined;
    let error: string | undefined;
    let data: T | undefined;
    let status: number | undefined;
    try {
      const res = await promise;
      status = res.status;

      if (res.status === 200) {
        data = res.data;
      }
      else if (res.status === 401) {
        snackbarError = 'Expired token';
      }
      else {
        error = `${res.status} : ${res.data}`;
      }
    }
    catch (e) {
      snackbarError = 'Request timeout';
    }

    if (loadingDialog != null) {
      loadingDialog.close();
    }

    return {
      data,
      status,
      snackbarError,
      error,
      success: snackbarError == null && error == null
    };
  }
}
