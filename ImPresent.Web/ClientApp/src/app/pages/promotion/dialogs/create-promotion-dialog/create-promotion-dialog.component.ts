import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UniversalValidators } from 'ngx-validators';

@Component({
  selector: 'app-create-promotion-dialog',
  templateUrl: './create-promotion-dialog.component.html',
  styleUrls: ['./create-promotion-dialog.component.scss']
})
export class CreatePromotionDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<CreatePromotionDialogComponent>
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

  create(): void {
    if(this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
