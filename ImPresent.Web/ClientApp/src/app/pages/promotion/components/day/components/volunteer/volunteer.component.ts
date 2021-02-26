import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { StudentDto } from 'src/app/shared/models/model';
import { DayPage } from 'src/app/pages/promotion/components/day/day-page';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent extends DayPage implements OnInit {

  form: FormGroup;
  filteredStudents: Observable<StudentDto[]> | undefined;
  selectedStudent: StudentDto | undefined;

  constructor(
    api: ApiService,
    fetchService: FetchService,
    snackbarService: SnackbarService,
    router: Router,
    storageService: StorageService,
    private readonly dialogService: DialogService,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    super(
      snackbarService,
      fetchService,
      api,
      router,
      storageService,
      false
    );

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
        await this.setDay(params.promotionId, params.dayId, false, true);
        this.loaded = true;
      }
    });
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
    if (this.form.valid && this.selectedStudent != null) {
      await this.addVolunteer(this.selectedStudent.id);
    }
    else {
      this.snackbarService.show('There is no student selected', {
        duration: 3000
      });
    }
  }

  private async addVolunteer(studentId: string): Promise<void> {
    console.log(this.day);
    if (this.day != null) {
      const loading = this.dialogService.showLoading();
      let error: string | undefined;
      try {
        const res = await this.api.addVolunteer(this.promotion.id, this.day.id, {
          studentId
        });

        if (res.status === 200) {
          this.success = 'You are a volunteer for this date';
        }
        else {
          error = `${res.status} : ${res.data}`;
        }
      }
      catch (e) {
        error = 'Request timeout';
      }

      loading.close();

      if (error != null) {
        this.snackbarService.show(error, {
          duration: 3000
        });
      }
    }
  }
}
