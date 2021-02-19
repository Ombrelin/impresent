import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from 'ng-particles';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgParticlesModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
})
export class HomeModule { }
