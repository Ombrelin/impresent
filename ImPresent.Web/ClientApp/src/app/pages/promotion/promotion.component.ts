import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/http/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Promotion } from 'src/app/shared/models/model';

import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  students: Array<string> = [];
  loaded = false;
  promotion: Promotion = {
    id: '',
    className: '',
    students: []
  };
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly storageService: StorageService,
    private readonly snackbarService: SnackbarService,
    private readonly api: ApiService
  ) {
    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }

    this.route.params.subscribe((params) => {
      if (params.id != null) {
        this.fetch(params.id);
      }
    });
  }

  ngOnInit(): void {

  }

  toDate(date: string): Date {
    return new Date(date);
  }

  private async fetch(id: string): Promise<void> {
    let error: string | null = null;
    try {
      const res = await this.api.getPromotion(this.token, id);

      if (res.status === 200) {
        this.loaded = true;
        this.promotion = res.data;
      }
      else if (res.status === 401) {
        error = 'Expired token';
        this.router.navigate(['']);
      }
      else {
        error = `${res.status} : ${res.data}`;
      }
    }
    catch (e) {
      error = 'Request timeout';
      this.router.navigate(['']);
    }

    if (error != null) {
      this.snackbarService.show(error, {
        duration: 3000
      });
    }
  }

  delete(): void {
  }

  add(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent, {
      data: this.promotion.id
    });

    dialog.afterClosed().subscribe((data) => {
      this.fetch(this.promotion.id);
    });
  }
}
