import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';
import { PromotionDto } from 'src/app/shared/models/model';


@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  error: string | null = null;
  loaded = false;
  promotion: PromotionDto = {
    id: '',
    className: '',
    students: [],
    presenceDays: []
  };
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly storageService: StorageService,
    private readonly snackbarService: SnackbarService,
    private readonly api: ApiService
  ) {
    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }

    this.route.params.subscribe((params) => {
      if (params.promotionId != null && params.dayId != null) {
        this.fetch(params.promotionId, params.dayId, true);
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void {

  }

  toDate(date: string): Date {
    return new Date(date);
  }

  private async fetch(promotionId: string, dayId: string, first = false): Promise<void> {
    let loadingDialog: MatDialogRef<LoadingDialogComponent> | null = null;
    if (first) {
      loadingDialog = this.dialogService.showLoading();
    }
    let snackBarError: string | null = null;
    try {
      const res = await this.api.getPromotion(promotionId);

      if (res.status === 200) {
        this.promotion = res.data;
      }
      else if (res.status === 401) {
        snackBarError = 'Expired token';
      }
      else {
        this.error = `${res.status} : ${res.data}`;
      }
    }
    catch (e) {
      snackBarError = 'Request timeout';
    }

    this.loaded = true;

    if (first && loadingDialog != null) {
      loadingDialog.close();
    }

    if (snackBarError != null) {
      this.snackbarService.show(snackBarError, {
        duration: 3000
      });
      this.router.navigate(['']);
    }
  }
}
