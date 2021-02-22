import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDayDialogComponent } from './add-day-dialog.component';

describe('AddDayDialogComponent', () => {
  let component: AddDayDialogComponent;
  let fixture: ComponentFixture<AddDayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDayDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
