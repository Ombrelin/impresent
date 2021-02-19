import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { particlesOptions } from 'src/app/core/utils/utils';
import { ApiService } from 'src/app/core/http/api.service';
import { CreatePromotionDialogComponent } from 'src/app/pages/promotion/dialogs/create-promotion-dialog/create-promotion-dialog.component';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  particlesOptions = particlesOptions;

  form: FormGroup;

  constructor(
    private readonly api: ApiService,
    private readonly dialogService: DialogService,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private fb: FormBuilder,
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

  async login(): Promise<void> {
    if (this.form.valid) {

      const loadingDialog = this.dialogService.showLoading();

      try {
        const res = await this.api.auth({
          promotionName: this.form.value.name,
          password: this.form.value.password
        });

        if (res.status === 200) {
          this.router.navigate(['/promotion', this.form.value.name]);
        }
        else {
          this.snackbarService.show(`${res.data}`, {
            duration: 3000
          });
        }
      }
      catch (e) {
        this.snackbarService.show('Request timeout...');
      }

      loadingDialog.close();
    }
  }

  create(): void {
    const dialog = this.dialog.open(CreatePromotionDialogComponent);
    dialog.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
}
