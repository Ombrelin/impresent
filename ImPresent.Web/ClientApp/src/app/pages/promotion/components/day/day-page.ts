import { Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { Fetch, FetchService, invalidPromotionId } from 'src/app/core/services/fetch/fetch.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PromotionPage } from 'src/app/pages/promotion/promotion-page';
import { DayDto, DayVolunteerDto } from 'src/app/shared/models/model';

export class DayPage extends PromotionPage {

  token: string | undefined;
  day: DayDto | undefined;
  dayVolunteers: DayVolunteerDto = {
    presenceDay: {
      id: '',
      date: ''
    },
    students: []
  };

  constructor(
    snackbarService: SnackbarService,
    fetchService: FetchService,
    api: ApiService,
    router: Router,
    protected readonly storageService: StorageService,
    isUnauthorized = false,
  ) {
    super(
      snackbarService,
      fetchService,
      api,
      router,
      isUnauthorized
    );

    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }
  }

  protected async setDay(promotionId: string, dayId: string, getVolunteers = false, loading = false): Promise<void> {
    await this.setPromotion(promotionId, loading);

    const day = this.promotion.presenceDays.find((el) => el.id === dayId);
    if (day != null) {
      this.day = day;
    }
    else {
      this.error = 'Invalid day';
    }

    if (getVolunteers && this.error == null && this.token != null) {
      const stateVolunteers = await this.fetchService.fetch(this.api.getVolunteers(this.token, promotionId, dayId), loading);
      this.manageVolunteers(stateVolunteers);
    }
  }

  private manageVolunteers(state: Fetch<DayVolunteerDto>): void {
    if (state.error != null) {
      this.error = state.error;
    }
    else if (state.snackbarError != null) {
      this.snackbarService.show(state.snackbarError, {
        duration: 3000
      });
      if (state.status === 401) {
        this.router.navigate(['']);
      }
    }
    else if (state.success && state.data != null) {
      this.dayVolunteers = state.data;
    }
    else if (this.error == null) {
      this.error = 'Invalid promotion or day';
    }
  }
}
