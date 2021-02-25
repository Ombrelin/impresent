import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { State, StateService } from 'src/app/core/services/state/state.service';
import { DayDto, PromotionDto, StudentDto } from 'src/app/shared/models/model';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  form: FormGroup;
  loaded = false;
  error: string | undefined;
  success: string | undefined;
  promotion: PromotionDto  = {
    className: '',
    id: '',
    presenceDays: [],
    students: []
  };
  day: DayDto | undefined;
  filteredStudents: Observable<StudentDto[]> | undefined;
  selectedStudent: StudentDto | undefined;

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly stateService: StateService,
    private readonly snackbarService: SnackbarService,
    private readonly dialogService: DialogService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      student: ['', [
        Validators.required
      ]]
    });

    const input = this.form.get('student');

    if (input != null) {
      this.filteredStudents = input.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.promotion.students.slice())
        );
    }
  }

  ngOnInit(): void {

    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null && params.dayId != null) {
        this.setData(params.promotionId, params.dayId, true);
      }
      else {
        this.loaded = true;
        this.error = 'Missing promotion or day id';
      }
    });
  }

  private async setData(promotionId: string, dayId: string, loading = false): Promise<void> {
    const state = await this.stateService.fetch(this.api.getPromotion(promotionId), loading);
    this.manageData(state, dayId);
  }

  private manageData(state: State<PromotionDto>, dayId: string): void {
    if (state.error != null || state.snackbarError != null) {
      this.error = state.error;
    }
    else if (state.success && state.data != null) {
      this.promotion = state.data;
      this.day = this.promotion?.presenceDays.find((val) => val.id === dayId);
      if (this.day == null) {
        this.error = 'Invalid day';
      }
    }
    else {
      this.error = 'Invalid promotion';
    }

    this.loaded = true;
  }

  private _filter(input: string): StudentDto[] {
    return this.promotion.students.filter(el => el.fullName.startsWith(input));
  }

  displayStudent(student: StudentDto): string {
    return student?.fullName ?? '';
  }

  toDate(date: string | undefined): Date {
    return date ? new Date(date) : new Date();
  }

  selectStudent(student: StudentDto): void {
    this.selectedStudent = student;
  }

  async volunteer(): Promise<void> {
    if (this.form.valid) {
      if (this.selectedStudent != null) {
        await this.addVolunteer(this.selectedStudent.id);
      }
      else {
        this.snackbarService.show('Student is not selected', {
          duration: 3000
        });
      }
    }
  }

  private async addVolunteer(studentId: string): Promise<void> {
    if (this.day != null) {
      const loading = this.dialogService.showLoading();
      let error: string | undefined;
      try {
        const res = await this.api.addVolunteer(this.promotion.id, this.day.id, {
          studentId: studentId
        });

        if (res.status === 200) {
          this.success = 'You are a volunteer for this date';
        }
        else {
          error = `${res.status} : ${res.data}`;
        }
      }
      catch(e) {
        error = 'Request timeout';
      }

      loading.close();

      if (error != null) {
        this.snackbarService.show(error, {
          duration: 3000
        })
      }
    }
  }
}
