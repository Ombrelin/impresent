import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'src/app/core/http/api.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { invalidPromotionId, Fetch, FetchService } from 'src/app/core/services/fetch/fetch.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DayDto, PromotionDto, StudentDto, DayVolunteerDto } from 'src/app/shared/models/model';

interface Volunteer {
  student: StudentDto;
  present: boolean;
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  error: string | null = null;
  loaded = false;
  day: DayDto | undefined;
  promotion: PromotionDto  = {
    className: '',
    id: '',
    presenceDays: [],
    students: []
  };
  dayVolunteers: DayVolunteerDto = {
    presenceDay: {
      id: '',
      date: ''
    },
    students: []
  }
  volunteers: Volunteer[] = [];
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly storageService: StorageService,
    private readonly snackbarService: SnackbarService,
    private readonly stateService: FetchService,
    private readonly api: ApiService
  ) {
    const token = this.storageService.getToken();
    if (token != null) {
      this.token = token;
    }

    this.route.params.subscribe((params) => {
      if (params.promotionId != null && params.dayId != null) {
        this.setData(params.promotionId, params.dayId);
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void {

  }

  private async setData(promotionId: string, dayId: string): Promise<void> {
    if (promotionId == null) {
      this.managePromotion(invalidPromotionId, dayId);
    }
    else {
      const statePromotion = await this.stateService.fetch(this.api.getPromotion(promotionId));
      this.managePromotion(statePromotion, dayId);
      if (this.error == null) {
        const stateVolunteers = await this.stateService.fetch(this.api.getVolunteers(this.token, promotionId, dayId));
        this.manageVolunteers(stateVolunteers);
      }

      if (this.error == null) {
        this.process();
      }
    }
  }

  private managePromotion(state: Fetch<PromotionDto>, dayId: string): void {
    if (state.error != null) {
      this.error = state.error;
    }
    else if (state.snackbarError != null) {
      this.snackbarService.show(state.snackbarError, {
        duration: 3000
      });
      if (state.status === 401) {
        this.router.navigate(['']);
      }
    }
    else if (state.success && state.data != null) {
      this.promotion = state.data;
      const day = this.promotion?.presenceDays.find((val) => val.id === dayId);
      if (day == null) {
        this.error = 'Invalid day';
      }
      else {
        this.day = day;
      }
    }
    else {
      this.error = 'Invalid promotion';
    }
  }

  private manageVolunteers(state: Fetch<DayVolunteerDto>): void {
    if (state.error != null) {
      this.error = state.error;
    }
    else if (state.snackbarError != null) {
      this.snackbarService.show(state.snackbarError, {
        duration: 3000
      });
      if (state.status === 401) {
        this.router.navigate(['']);
      }
    }
    else if (state.success && state.data != null) {
      this.dayVolunteers = state.data;
    }
    else if (this.error == null) {
      this.error = 'Invalid promotion or day';
    }

    this.loaded = true;
  }

  private process(): void {

    const volunteers = new Map<string, StudentDto>();

    this.dayVolunteers.students.forEach((volunteer) => {
      volunteers.set(volunteer.id, volunteer);
    });

    this.promotion.students.forEach((student) => {
      this.volunteers.push({
        student,
        present: volunteers.has(student.id)
      })
    });
  }

  toDate(date: string | undefined): Date {
    return date ? new Date(date) : new Date();
  }

  export(): void {
    
  }
}
