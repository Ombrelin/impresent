import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';

import { ApiService } from 'src/app/core/http/api.service';
import { invalidPromotionId, State, StateService } from 'src/app/core/services/state/state.service';
import { DayDto, PromotionDto } from 'src/app/shared/models/model';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  form: FormGroup;

  loaded = false;
  error: string | undefined;
  promotion: PromotionDto | undefined;
  day: DayDto | undefined;

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly stateService: StateService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      student: ['', [
        UniversalValidators.noEmptyString,
        Validators.required
      ]],
      day: ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null && params.dayId != null) {
        this.setData(params.promotionId, params.dayId, true);
      }
      else {
        this.loaded = true;
        this.error = 'Missing promotion or day id';
      }
    });
  }

  private async setData(promotionId: string, dayId: string, loading = false): Promise<void> {
    const state = await this.stateService.fetch(this.api.getPromotion(promotionId), loading);
    this.manageData(state, dayId);
  }

  private manageData(state: State<PromotionDto>, dayId: string): void {
    if (state.error != null || state.snackbarError != null) {
      this.error = state.error;
    }
    else if (state.success) {
      this.promotion = state.data;
      this.day = this.promotion?.presenceDays.find((val) => val.id === dayId);
      if (this.day == null) {
        this.error = 'Invalid day';
      }
    }
    else {
      this.error = 'Invalid promotion';
    }

    this.loaded = true;
  }

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  volunteer(): void {
    if (this.form.valid) {
      //todo: use api
    }
  }
}
