import { Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { Fetch, FetchService } from 'src/app/core/services/fetch/fetch.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PromotionPage } from 'src/app/pages/promotion/promotion-page';
import { DayDto, DayVolunteerDto } from 'src/app/shared/models/model';

export class DayPage extends PromotionPage {

  token = '';
  day: DayDto = {
    id: '',
    date: ''
  };
  dayVolunteers: DayVolunteerDto = {
    presenceDay: {
      id: '',
      date: ''
    },
    students: [],
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

    if (this.error == null) {
      const day = this.promotion.presenceDays.find((el) => el.id === dayId);
      if (day != null) {
        this.day = day;
      }
      else {
        this.error = $localize`Day not found`;
      }
    }

    if (getVolunteers && this.error == null && this.token != null) {
      const fetch = await this.fetchService.fetch(this.api.getVolunteers(this.token, promotionId, dayId), loading);
      this.manageVolunteers(fetch);
    }
  }

  private manageVolunteers(fetch: Fetch<DayVolunteerDto>): void {
    if (fetch.error != null) {
      this.error = fetch.error;
    }
    else if (fetch.snackbarError != null) {
      this.snackbarService.show(fetch.snackbarError, {
        duration: 3000
      });
      if (fetch.status === 401) {
        this.router.navigate(['']);
      }
    }
    else if (fetch.success && fetch.data != null) {
      this.dayVolunteers = fetch.data;
    }
    else if (this.error == null) {
      this.error = $localize`Promotion or day not found`;
    }
  }
}
