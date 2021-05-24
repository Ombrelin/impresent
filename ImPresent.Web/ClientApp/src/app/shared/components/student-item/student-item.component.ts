import { Component, Input } from '@angular/core';
import { StudentDto } from 'src/app/shared/models/model';

@Component({
  selector: 'app-student-item',
  templateUrl: './student-item.component.html',
  styleUrls: ['./student-item.component.scss']
})
export class StudentItemComponent {

  @Input() student: StudentDto = {
    id: '',
    fullName: '',
    lastPresence: ''
  };

  constructor() { }

  toDate(date: string): Date {
    return new Date(date);
  }

}
