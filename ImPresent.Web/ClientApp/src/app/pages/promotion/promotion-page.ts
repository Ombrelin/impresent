import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/http/api.service';
import { Fetch, FetchService, invalidPromotionId } from 'src/app/core/services/fetch/fetch.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { Page } from 'src/app/shared/components/page/page';
import { PromotionDto } from 'src/app/shared/models/model';

export class PromotionPage extends Page {

  promotion: PromotionDto  = {
    className: '',
    id: '',
    presenceDays: [],
    students: []
  };

  constructor(
    protected readonly snackbarService: SnackbarService,
    protected readonly fetchService: FetchService,
    protected readonly api: ApiService,
    protected readonly router: Router,
    protected readonly isUnauthorized = true
  ) {
    super();
  }

  protected async setPromotion(promotionId: string | undefined, loading = false): Promise<void> {
    if (promotionId == null) {
      this.managePromotion(invalidPromotionId);
    }
    else {
      const state = await this.fetchService.fetch(this.api.getPromotion(promotionId), loading);
      this.managePromotion(state);
    }
  }

  private managePromotion(fetch: Fetch<PromotionDto>): void {
    if (fetch.error != null) {
      this.error = fetch.error;
    }
    else if (fetch.snackbarError != null) {
      this.snackbarService.show(fetch.snackbarError, {
        duration: 3000
      });
      if (this.isUnauthorized && fetch.status === 401) {
        this.router.navigate(['']);
      }
    }
    else if (fetch.success && fetch.data != null) {
      this.promotion = fetch.data;
    }
    else {
      this.error = 'Invalid promotion';
    }
  }
}
