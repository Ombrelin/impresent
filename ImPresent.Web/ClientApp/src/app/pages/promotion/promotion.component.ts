import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';
import { AddDayDialogComponent } from './dialogs/add-day-dialog/add-day-dialog.component';
import { PromotionDto, DayDto } from 'src/app/shared/models/model';
import { State, StateService } from 'src/app/core/services/state/state.service';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  loaded = false;
  error: string | null = null;
  promotion: PromotionDto | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackbarService: SnackbarService,
    private readonly stateService: StateService
  ) {
    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null) {
        const state = await this.stateService.getPromotion(params.promotionId, true);
        this.manageState(state);
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void { }

  toDate(date: string): Date {
    return new Date(date);
  }

  private manageState(state: State<PromotionDto>): void {
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
    else if (state.success) {
      this.promotion = state.data;
    }
    else {
      this.error = 'Invalid promotion';
    }
  }

  openDay(day: DayDto): void {
    this.router.navigate(['promotion', this.promotion?.id, 'day', day.id]);
  }

  addDay(): void {
    const dialog = this.dialog.open(AddDayDialogComponent, {
      data: this.promotion?.id
    });

    dialog.afterClosed().subscribe(async (data) => {
      const state = await this.stateService.updatePromotion(this.promotion?.id);
      this.manageState(state);
    });
  }

  addStudent(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent, {
      data: this.promotion?.id
    });

    dialog.afterClosed().subscribe(async (data) => {
      const state = await this.stateService.updatePromotion(this.promotion?.id);
      this.manageState(state);
    });
  }
}
