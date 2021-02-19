import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UniversalValidators } from 'ngx-validators';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.scss']
})
export class AddStudentDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly dialog: MatDialogRef<AddStudentDialogComponent>
  ) {
    this.form = this.fb.group({
      name: ['', [
        UniversalValidators.noWhitespace,
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
  }

  add(): void{
    if (this.form.valid) {
      this.dialog.close(this.form.value);
    }
  }
}
