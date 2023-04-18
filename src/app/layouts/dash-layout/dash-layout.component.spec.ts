import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashLayoutComponent } from './dash-layout.component';

describe('DashLayoutComponent', () => {
  let component: DashLayoutComponent;
  let fixture: ComponentFixture<DashLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
