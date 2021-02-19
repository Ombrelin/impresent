import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  students: Array<string> = [
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
  ];

  constructor(
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  delete(): void {
  }

  add(): void {
    const dialog = this.dialog.open(AddStudentDialogComponent);

    dialog.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
}
