import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api.service';
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
  }

  ngOnInit(): void {

    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null && params.dayId != null) {
        await this.setDay(params.promotionId, params.dayId, false, true);
        this.setupStudents();
        this.loaded = true;
      }
    });
  }

  private setupStudents(): void {
    const input = this.form.get('student');

    if (input != null) {
      this.filteredStudents = input.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this.filter(name) : this.promotion.students.slice())
        );
    }
  }

  private filter(input: string): StudentDto[] {
    return this.promotion.students.filter(el => el.fullName.toLowerCase().includes(input));
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
      this.snackbarService.show($localize`There is no student selected`, {
        duration: 3000
      });
    }
  }

  private async addVolunteer(studentId: string): Promise<void> {
    let error: string | undefined;
    const fetch = await this.fetchService.fetch(
      this.api.addVolunteer(this.promotion.id, this.day.id, {
        studentId
      }),
      true
    );

    if (fetch.success) {
      this.success = $localize`You are a volunteer for this date`;
    }
    else if (fetch.status === 401) {
      error = $localize`Expired token`;
      this.router.navigate(['']);
    }
    else {
      error = fetch.error ?? fetch.snackbarError;
    }

    if (error != null) {
      this.snackbarService.show(error, {
        duration: 3000
      });
    }
  }
}
