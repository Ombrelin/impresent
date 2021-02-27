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
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent extends DayPage implements OnInit {

  volunteers: Volunteer[] = [];
  volunteersStudent = new Map<string, StudentDto>();

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
      this.volunteersStudent.set(volunteer.id, volunteer);
    });

    this.promotion.students.forEach((student) => {
      this.volunteers.push({
        student,
        present: this.volunteersStudent.has(student.id)
      });
    });
  }

  toDate(date: string | undefined): Date {
    return date ? new Date(date) : new Date();
  }

  share(): void {
    this.clipboard.copy(`${window.location.href}/volunteer`);
    this.snackbarService.show('Url copied');
  }

  save(): void {
  }

  export(): void {
    const csv = ['Name'];
    this.volunteersStudent.forEach((volunteer) => {
      csv.push(volunteer.fullName);
    });

    const data = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `volunteers-${this.day?.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
