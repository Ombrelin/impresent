import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService, createApiService } from './http/api.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: ApiService, useValue: createApiService() },
  ]
})
export class CoreModule { }
