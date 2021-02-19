import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { particlesOptions } from 'src/app/core/utils/utils';
import { CreatePromotionDialogComponent } from 'src/app/pages/promotion/dialogs/create-promotion-dialog/create-promotion-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  particlesOptions = particlesOptions;

  form: FormGroup;

  constructor(
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

  login(): void {
    if (this.form.valid) {
      this.router.navigate(['/promotion', this.form.value.name]);
    }
  }

  create(): void {
    const dialog = this.dialog.open(CreatePromotionDialogComponent);
    dialog.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
}
