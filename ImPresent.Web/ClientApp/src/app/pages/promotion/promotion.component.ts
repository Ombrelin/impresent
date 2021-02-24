import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';
import { AddDayDialogComponent } from './dialogs/add-day-dialog/add-day-dialog.component';
import { PromotionDto, DayDto } from 'src/app/shared/models/model';
import { invalidPromotionId, State, StateService } from 'src/app/core/services/state/state.service';
import { ApiService } from 'src/app/core/http/api.service';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  loaded = false;
  error: string | null = null;
  promotion: PromotionDto  = {
    className: '',
    id: '',
    presenceDays: [],
    students: []
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackbarService: SnackbarService,
    private readonly stateService: StateService,
    private readonly api: ApiService
  ) {
    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null) {
        this.setPromotion(params.promotionId, true);
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void { }

  private async setPromotion(promotionId: string | undefined, loading = false): Promise<void> {
    if (promotionId == null) {
      this.managePromotion(invalidPromotionId);
    }
    else {
      const state = await this.stateService.fetch(this.api.getPromotion(promotionId), loading);
      this.managePromotion(state);
    }
  }

  private managePromotion(state: State<PromotionDto>): void {
    this.loaded = true;
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
    }
    else {
      this.error = 'Invalid promotion';
    }
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

    dialog.afterClosed().subscribe(async (data) => {
      this.setPromotion(this.promotion?.id);
    });
  }

  addStudent(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent, {
      data: this.promotion?.id
    });

    dialog.afterClosed().subscribe(async (data) => {
      this.setPromotion(this.promotion?.id);
    });
  }
}
