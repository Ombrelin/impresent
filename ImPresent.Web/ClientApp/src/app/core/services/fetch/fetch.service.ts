import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiResponse } from 'ts-retrofit2';

import { PromotionDto } from 'src/app/shared/models/model';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';

export interface Fetch<T> {
  data?: T;
  status?: number;
  snackbarError?: string;
  error?: string;
  success: boolean;
}

export const invalidPromotionId: Fetch<PromotionDto> = {
  snackbarError: $localize`Promotion not found`,
  success: false
};

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  constructor(
    private readonly dialogService: DialogService,
  ) { }

  async fetch<T>(promise: ApiResponse<T>, loading = false): Promise<Fetch<T>> {
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
        snackbarError = $localize`Expired token`;
      }
      else {
        error = `${res.data}`;
      }
    }
    catch (e) {
      snackbarError = $localize`Request timeout`;
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
