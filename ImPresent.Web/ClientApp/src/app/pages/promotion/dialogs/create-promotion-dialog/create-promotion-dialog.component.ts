import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UniversalValidators } from 'ngx-validators';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
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
    private readonly dialogService: DialogService,
    private readonly snackbarService: SnackbarService,
    private readonly api: ApiService,
    private readonly dialog: MatDialogRef<CreatePromotionDialogComponent>
  ) {
    this.form = this.fb.group({
      name: ['', [
        UniversalValidators.noWhitespace,
        Validators.required
      ]],
      password: ['', [
        UniversalValidators.noWhitespace,
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
  }

  async create(): Promise<void> {
    if (this.form.valid) {

      const loadingDialog = this.dialogService.showLoading();
      const addPromotion: AddPromotionDto = {
        name: this.form.value.name,
        password: this.form.value.password
      };

      try {
        const res = await this.api.addPromotion(addPromotion);

        if (res.status === 200) {
          this.dialog.close(addPromotion);
        }
        else {
          this.snackbarService.show(`${res.data}`);
        }
      }
      catch (e) {
        this.snackbarService.show('Request timeout...');
      }

      loadingDialog.close();
    }
  }
}
