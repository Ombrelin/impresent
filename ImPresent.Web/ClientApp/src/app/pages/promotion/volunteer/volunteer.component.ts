import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';
import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { PromotionDto } from 'src/app/shared/models/model';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  form: FormGroup;

  loaded = false;
  error: string | null = null;
  promotion: PromotionDto = {
    id: '',
    className: '',
    students: [],
    presenceDays: []
  };

  constructor(
    private readonly api: ApiService,
    private readonly dialogService: DialogService,
    private readonly route: ActivatedRoute,
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
    this.route.params.subscribe((params) => {
      if (params.promotionId != null) {
        this.fetch(params.promotionId);
      }
    });
  }

  private async fetch(promotionId: string): Promise<void> {
    const loadingDialog = this.dialogService.showLoading();
    try {
      const res = await this.api.getPromotion(promotionId);

      if (res.status === 200) {
        this.promotion = res.data;
      }
      else {
        this.error = `${res.status} : ${res.data}`;
      }
    }
    catch (e) {
      this.error = 'Request timeout';
    }

    this.loaded = true;
    loadingDialog.close();
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
