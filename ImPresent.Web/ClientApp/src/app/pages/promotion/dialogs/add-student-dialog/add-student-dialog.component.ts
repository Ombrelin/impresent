import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UniversalValidators } from 'ngx-validators';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { AddStudentDto } from 'src/app/shared/models/model';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.scss']
})
export class AddStudentDialogComponent implements OnInit {

  form: FormGroup;
  token = '';

  constructor(
    private fb: FormBuilder,
    private readonly storageService: StorageService,
    private readonly api: ApiService,
    private readonly snackbarService: SnackbarService,
    private readonly dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) private readonly data: string,
    private readonly dialog: MatDialogRef<AddStudentDialogComponent>,
    private readonly router: Router
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

  ngOnInit(): void {
  }

  async add(): Promise<void>{
    if (this.form.valid) {
      const loadingDialog = this.dialogService.showLoading();
      const data: AddStudentDto = {
        fullName: this.form.value.name,
        lastPresence: new Date().toISOString()
      };
      let error: string | null = null;

      try {
        const res = await this.api.addStudent(this.token, this.data, data);

        if (res.status === 200) {
          this.dialog.close(res.data);
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
      }

      loadingDialog.close();

      if (error != null) {
        this.snackbarService.show(error, {
          duration: 3000
        });
      }
    }
  }
}
