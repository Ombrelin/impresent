import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { invalidPromotionId, State, StateService } from 'src/app/core/services/state/state.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';
import { DayDto, PromotionDto, VolunteerDto } from 'src/app/shared/models/model';


@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  error: string | null = null;
  loaded = false;
  day: DayDto | undefined;
  promotion: PromotionDto  = {
    className: '',
    id: '',
    presenceDays: [],
    students: []
  };
  volunteers: Array<VolunteerDto> = [];
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly storageService: StorageService,
    private readonly snackbarService: SnackbarService,
    private readonly stateService: StateService,
    private readonly api: ApiService
  ) {
    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }

    this.route.params.subscribe((params) => {
      if (params.promotionId != null && params.dayId != null) {
        this.setData(params.promotionId, params.dayId);
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void {

  }

  private async setData(promotionId: string, dayId: string): Promise<void> {
    if (promotionId == null) {
      this.managePromotion(invalidPromotionId, dayId);
    }
    else {
      const statePromotion = await this.stateService.fetch(this.api.getPromotion(promotionId));
      this.managePromotion(statePromotion, dayId);
      const stateVolunteers = await this.stateService.fetch(this.api.getVolunteers(this.token, promotionId, dayId));
      this.manageVolunteers(stateVolunteers);
    }
  }

  private managePromotion(state: State<PromotionDto>, dayId: string): void {
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
      this.promotion = state.data;
      this.day = this.promotion?.presenceDays.find((val) => val.id === dayId);
      if (this.day == null) {
        this.error = 'Invalid day';
      }
    }
    else {
      this.error = 'Invalid promotion';
    }
  }

  private manageVolunteers(state: State<Array<VolunteerDto>>): void {
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
      this.volunteers = state.data;
      console.log(this.volunteers);
    }
    else if (this.error == null) {
      this.error = 'Invalid promotion or day';
    }

    this.loaded = true;
  }

  toDate(date: string): Date {
    return new Date(date);
  }
}
