import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/core/http/api.service';
import { CreatePromotionDialogComponent } from 'src/app/pages/home/dialogs/create-promotion-dialog/create-promotion-dialog.component';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Page } from 'src/app/shared/components/page/page';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { AuthToken } from 'src/app/shared/models/model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Page {

  form: FormGroup;

  constructor(
    private readonly api: ApiService,
    private readonly snackbarService: SnackbarService,
    private readonly storageService: StorageService,
    private readonly stateService: FetchService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    super();

    this.loaded = true;

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

  async login(): Promise<void> {
    if (this.form.valid) {

      const state = await this.stateService.fetch<AuthToken>(this.api.auth({
        promotionName: this.form.value.name,
        password: this.form.value.password
      }), true);

      if (state.success && state.data != null) {
        this.storageService.setToken(state.data.token);
        this.router.navigate(['/promotion', state.data.id]);
      }
      else if (state.error != null || state.snackbarError != null) {
        const error = state.error ?? state.snackbarError;
        if (error != null) {
          this.snackbarService.show(error, {
            duration: 3000
          });
        }
      }
    }
  }

  create(): void {
    const dialog = this.dialog.open(CreatePromotionDialogComponent);
    dialog.afterClosed().subscribe((data) => {
      this.router.navigate(['promotion', data.id]);
    });
  }
}
