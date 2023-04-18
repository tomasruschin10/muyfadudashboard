import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeCareerComponent } from './college-career.component';

describe('CollegeCareerComponent', () => {
  let component: CollegeCareerComponent;
  let fixture: ComponentFixture<CollegeCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeCareerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
