import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { AddStudentDialogComponent } from './dialogs/add-student/add-student-dialog.component';
import { AddDayDialogComponent } from './dialogs/add-day/add-day-dialog.component';
import { DayDto } from 'src/app/shared/models/model';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { ApiService } from 'src/app/core/http/api.service';
import { PromotionPage } from './promotion-page';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent extends PromotionPage {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    router: Router,
    snackbarService: SnackbarService,
    fetchService: FetchService,
    api: ApiService,
  ) {
    super(
      snackbarService,
      fetchService,
      api,
      router
    );
    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null) {
        await this.setPromotion(params.promotionId, true);
        this.loaded = true;
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  toDate(date: string): Date {
    return new Date(date);
  }

  openDay(day: DayDto): void {
    this.router.navigate(['promotion', this.promotion?.id, 'day', day.id]);
  }

  addDay(): void {
    const dialog = this.dialog.open(AddDayDialogComponent, {
      data: this.promotion?.id
    });

    dialog.afterClosed().subscribe(async () => {
      this.setPromotion(this.promotion?.id);
    });
  }

  addStudent(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent, {
      data: this.promotion?.id
    });

    dialog.afterClosed().subscribe(async () => {
      this.setPromotion(this.promotion?.id);
    });
  }
}
