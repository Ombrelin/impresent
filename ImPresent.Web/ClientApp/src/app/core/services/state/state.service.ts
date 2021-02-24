import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiResponse } from 'ts-retrofit2';

import { PromotionDto } from 'src/app/shared/models/model';
import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';
import { CacheService } from 'src/app/core/services/cache/cache.service';

export interface State<T> {
  data: T | null;
  snackbarError: string | null;
  error: string | null;
  success: boolean;
}

const invalidPromotionId: State<PromotionDto> = {
  data: null,
  snackbarError: 'Invalid promotion id',
  error: null,
  success: false
};

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private readonly api: ApiService,
    private readonly dialogService: DialogService,
    private readonly cacheService: CacheService
  ) { }

  async getPromotion(promotionId: string | null | undefined, loading = false): Promise<State<PromotionDto>> {
    if (promotionId == null) {
      return invalidPromotionId;
    }
    const promotion = this.cacheService.getPromotion(promotionId);
    let state: State<PromotionDto> = {
      data: promotion,
      snackbarError: null,
      error: null,
      success: promotion != null
    };
    if (promotion == null) {
      state = await this.updatePromotion(promotionId, loading);
    }

    return state;
  }

  async updatePromotion(promotionId: string | null | undefined, loading = false): Promise<State<PromotionDto>> {
    if (promotionId == null) {
      return invalidPromotionId;
    }
    const state = await this.fetch<PromotionDto>(this.api.getPromotion(promotionId), loading);
    if (state.data != null) {
      this.cacheService.setPromotion(state.data);
    }
    return state;
  }

  private async fetch<T>(promise: ApiResponse<T>, loading = false): Promise<State<T>> {
    let loadingDialog: MatDialogRef<LoadingDialogComponent> | null = null;
    if (loading) {
      loadingDialog = this.dialogService.showLoading();
    }
    let snackbarError: string | null = null;
    let error: string | null = null;
    let result: T | null = null;
    try {
      const res = await promise;

      if (res.status === 200) {
        result = res.data;
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
      data: result,
      snackbarError,
      error,
      success: snackbarError == null && error == null
    };
  }
}
