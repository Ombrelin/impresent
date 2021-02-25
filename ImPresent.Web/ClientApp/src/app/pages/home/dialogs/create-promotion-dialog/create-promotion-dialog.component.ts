import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UniversalValidators } from 'ngx-validators';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { AddPromotionDto } from 'src/app/shared/models/model';

@Component({
  selector: 'app-create-promotion-dialog',
  templateUrl: './create-promotion-dialog.component.html',
  styleUrls: ['./create-promotion-dialog.component.scss']
})
export class CreatePromotionDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly snackbarService: SnackbarService,
    private readonly fetchService: FetchService,
    private readonly api: ApiService,
    private readonly dialog: MatDialogRef<CreatePromotionDialogComponent>
  ) {
    this.form = this.fb.group({
      name: ['', [
        UniversalValidators.noEmptyString,
        Validators.required
      ]],
      password: ['', [
        UniversalValidators.noEmptyString,
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialog.close(null);
  }

  async create(): Promise<void> {
    if (this.form.valid) {

      const fetch = await this.fetchService.fetch(this.api.addPromotion({
        name: this.form.value.name,
        password: this.form.value.password
      }), true);

      if (fetch.success && fetch.data != null) {
        this.dialog.close(fetch.data);
      }
      else if (fetch.error != null || fetch.snackbarError != null) {
        const error = fetch.error ?? fetch.snackbarError;
        if (error != null) {
          this.snackbarService.show(error, {
            duration: 3000
          });
        }
      }
    }
  }
}
