import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePromotionDialogComponent } from './create-promotion-dialog.component';

describe('CreatePromotionDialogComponent', () => {
  let component: CreatePromotionDialogComponent;
  let fixture: ComponentFixture<CreatePromotionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePromotionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePromotionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
