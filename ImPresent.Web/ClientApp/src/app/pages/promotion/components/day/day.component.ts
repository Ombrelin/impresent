import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

import { ApiService } from 'src/app/core/http/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { FetchService } from 'src/app/core/services/fetch/fetch.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { StudentDto } from 'src/app/shared/models/model';
import { DayPage } from './day-page';

interface Volunteer {
  student: StudentDto;
  present: boolean;
  added: boolean;
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent extends DayPage implements OnInit {

  volunteers = new Map<string, Volunteer>();
  volunteersArray: Volunteer[] = [];
  dayStudents = new Map<string, StudentDto>();
  dayStudentsArray: StudentDto[] = [];

  constructor(
    private readonly clipboard: Clipboard,
    private readonly route: ActivatedRoute,
    router: Router,
    storageService: StorageService,
    snackbarService: SnackbarService,
    fetchService: FetchService,
    api: ApiService
  ) {
    super(
      snackbarService,
      fetchService,
      api,
      router,
      storageService
    );

    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }

    this.route.params.subscribe(async (params) => {
      if (params.promotionId != null && params.dayId != null) {
        await this.setDay(params.promotionId, params.dayId, true, true);
        if (this.promotion != null && this.dayVolunteers != null) {
          this.process();
          this.loaded = true;
        }
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void {

  }

  private process(): void {

    this.dayVolunteers.students.forEach((volunteer) => {
      this.dayStudents.set(volunteer.id, volunteer);
    });

    this.promotion.students.forEach((student) => {
      this.volunteers.set(student.id, {
        student,
        present: this.dayStudents.has(student.id),
        added: false
      });
    });

    this.volunteersArray = Array.from(this.volunteers.values());
    this.updateDayStudents();
  }

  updateDayStudents(): void {
    this.dayStudentsArray = Array.from(this.dayStudents.values());
  }

  toDate(date: string | undefined): Date {
    return date ? new Date(date) : new Date();
  }

  toggleMark(volunteer: Volunteer): void {
    volunteer.added = !volunteer.added;
    if (volunteer.added) {
      this.dayStudents.set(volunteer.student.id, volunteer.student);
    }
    else {
      this.dayStudents.delete(volunteer.student.id);
    }

    this.updateDayStudents();
  }

  share(): void {
    this.clipboard.copy(`${window.location.href}/volunteer`);
    this.snackbarService.show($localize`Url copied`);
  }

  async save(): Promise<void> {

    const ids: string[] = [];
    this.dayStudents.forEach((student) => {
      ids.push(student.id);
    });

    let error: string | undefined;
    const fetch = await this.fetchService.fetch(
      this.api.validate(this.token, this.promotion.id, this.day?.id, ids),
      true
    );

    if (!fetch.success) {
      error = fetch.error ?? fetch.snackbarError;
    }
    else if (fetch.status === 401) {
      error = $localize`Expired token`;
      this.router.navigate(['']);
    }

    const msg = error ?? $localize`Successfully saved`;

    this.snackbarService.show(msg, {
      duration: 3000
    });
  }

  export(): void {
    const csv = ['Name'];

    this.volunteers.forEach((volunteer) => {
      if (this.dayStudents.has(volunteer.student.id) || volunteer.added) {
        csv.push(volunteer.student.fullName);
      }
    });

    const data = `\ufeff${csv.join('\r\n')}`;

    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `volunteers-${this.day?.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
