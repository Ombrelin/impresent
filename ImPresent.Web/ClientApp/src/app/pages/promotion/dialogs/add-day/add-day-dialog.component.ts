import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-add-day-dialog',
  templateUrl: './add-day-dialog.component.html',
  styleUrls: ['./add-day-dialog.component.scss']
})
export class AddDayDialogComponent {

  form: FormGroup;
  now = new Date();
  token = '';

  constructor(
    private fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly api: ApiService,
    private readonly snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) private readonly promotionId: string,
    private readonly dialog: MatDialogRef<AddDayDialogComponent>,
    private readonly fetchService: FetchService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      day: ['', [
        Validators.required
      ]]
    });

    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }
  }

  async add(): Promise<void>{
    if (this.form.valid) {
      const date: Date = this.form.value.day;
      date.setHours(12);
      const fetch = await this.fetchService.fetch(this.api.addDay(this.token, this.promotionId, {
        date: date.toISOString(),
      }), true);

      let error: string | undefined;

      if (!fetch.success) {
        error = fetch.error ?? fetch.snackbarError;
      }
      else if (fetch.status === 401) {
        error = $localize`Expired token`;
        this.router.navigate(['']);
      }

      if (error == null) {
        this.dialog.close(fetch.data);
      }

      this.snackbarService.show(error ?? $localize`Day successfully added`, {
        duration: 3000
      });
    }
  }
}
