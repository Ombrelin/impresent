import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.scss']
})
export class AddStudentDialogComponent {

  form: FormGroup;
  token = '';

  constructor(
    private fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly api: ApiService,
    private readonly snackbarService: SnackbarService,
    private readonly dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) private readonly promotionId: string,
    private readonly dialog: MatDialogRef<AddStudentDialogComponent>,
    private readonly router: Router,
    private readonly fetchService: FetchService
  ) {
    this.form = this.fb.group({
      name: ['', [
        UniversalValidators.noEmptyString,
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
      const fetch = await this.fetchService.fetch(this.api.addStudent(this.token, this.promotionId, {
        fullName: this.form.value.name,
        lastPresence: new Date().toISOString()
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

      this.snackbarService.show(error ?? $localize`Student successfully added`, {
        duration: 3000
      });
    }
  }
}
