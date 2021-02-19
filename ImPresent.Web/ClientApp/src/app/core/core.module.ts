import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService, createApiService } from './http/api.service';
import { DialogService } from './services/dialog/dialog.service';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { StorageService } from './services/storage/storage.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: ApiService, useValue: createApiService() },
    DialogService,
    SnackbarService,
    StorageService
  ]
})
export class CoreModule { }
