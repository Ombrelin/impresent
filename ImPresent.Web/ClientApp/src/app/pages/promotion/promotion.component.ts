import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDialogComponent } from 'src/app/shared/components/dialogs/loading-dialog/loading-dialog.component';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';
import { AddDayDialogComponent } from './dialogs/add-day-dialog/add-day-dialog.component';
import { PromotionDto, DayDto } from 'src/app/shared/models/model';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  loaded = false;
  error: string | null = null;
  promotion: PromotionDto = {
    id: '',
    className: '',
    students: [],
    presenceDays: []
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly dialogService: DialogService,
    private readonly snackbarService: SnackbarService,
    private readonly api: ApiService
  ) {
    this.route.params.subscribe((params) => {
      if (params.promotionId != null) {
        this.fetch(params.promotionId, true);
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

  private async fetch(promotionId: string, first = false): Promise<void> {
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

  openDay(day: DayDto): void {
    this.router.navigate(['promotion', this.promotion.id, 'day', day.id]);
  }

  addDay(): void {
    const dialog = this.dialog.open(AddDayDialogComponent, {
      data: this.promotion.id
    });

    dialog.afterClosed().subscribe((data) => {
      this.fetch(this.promotion.id);
    });
  }

  addStudent(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent, {
      data: this.promotion.id
    });

    dialog.afterClosed().subscribe((data) => {
      this.fetch(this.promotion.id);
    });
  }
}
