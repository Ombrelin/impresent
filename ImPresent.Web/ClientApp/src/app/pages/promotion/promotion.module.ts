import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from 'ng-particles';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionComponent } from './promotion.component';
import { CreatePromotionDialogComponent } from '../home/dialogs/create-promotion-dialog/create-promotion-dialog.component';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';
import { VolunteerComponent } from './components/day/components/volunteer/volunteer.component';
import { AddDayDialogComponent } from './dialogs/add-day-dialog/add-day-dialog.component';
import { DayComponent } from './components/day/day.component';

@NgModule({
  declarations: [
    PromotionComponent,
    CreatePromotionDialogComponent,
    AddStudentDialogComponent,
    VolunteerComponent,
    AddDayDialogComponent,
    DayComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgParticlesModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    ClipboardModule
  ],
})
export class PromotionModule { }
