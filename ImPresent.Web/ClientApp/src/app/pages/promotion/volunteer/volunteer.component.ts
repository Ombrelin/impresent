import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';

import { ApiService } from 'src/app/core/http/api.service';
import { State, StateService } from 'src/app/core/services/state/state.service';
import { PromotionDto } from 'src/app/shared/models/model';

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
      if (params.promotionId != null) {
        const state = await this.stateService.getPromotion(params.promotionId, true);
        this.manageState(state);
      }
    });
  }

  private manageState(state: State<PromotionDto>): void {
    this.loaded = true;
    if (state.error != null || state.snackbarError != null) {
      this.error = state.error;
    }
    else if (state.success) {
      this.promotion = state.data;
    }
    else {
      this.error = 'Invalid promotion';
    }
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
