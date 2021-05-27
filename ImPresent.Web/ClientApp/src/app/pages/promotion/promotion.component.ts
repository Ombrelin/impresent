import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { AddStudentDialogComponent } from './dialogs/add-student/add-student-dialog.component';
import { AddDayDialogComponent } from './dialogs/add-day/add-day-dialog.component';
import { DayDto } from 'src/app/shared/models/model';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { ApiService } from 'src/app/core/http/api.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PromotionPage } from './promotion-page';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent extends PromotionPage {

  @ViewChild('upload') upload: ElementRef | undefined;

  private token: string | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    router: Router,
    snackbarService: SnackbarService,
    fetchService: FetchService,
    api: ApiService,
    private readonly storageService: StorageService,
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

    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }
  }

  toDate(date: string): Date {
    return new Date(date);
  }

  openDay(day: DayDto): void {
    this.router.navigate(['promotion', this.promotion.id, 'day', day.id]);
  }

  addDay(): void {
    const dialog = this.dialog.open(AddDayDialogComponent, {
      data: this.promotion.id
    });

    dialog.afterClosed().subscribe(async () => {
      this.setPromotion(this.promotion.id);
    });
  }

  addStudent(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent, {
      data: this.promotion.id
    });

    dialog.afterClosed().subscribe(async () => {
      this.setPromotion(this.promotion.id);
    });
  }

  openUpload(): void {
    if (this.upload != null) {
      this.upload.nativeElement.click();
    }
  }

  async importStudents(target: any): Promise<void> {
    if (target != null && target.files.length > 0) {
      const file = target.files.item(0);
      if (this.token != null) {
        const state = await this.fetchService.fetch(this.api.importStudents(this.token, this.promotion.id, {
          value: file,
          filename: file.name
        }), true);
        if (state.success) {
          this.setPromotion(this.promotion.id);
          this.snackbarService.show($localize`Students imported successfully`);
        }
        else {
          this.snackbarService.show($localize`Failed to import the students: ${state.status}`);
        }
      }
    }
    else {
      this.snackbarService.show($localize`No file selected`);
    }
  }
}
