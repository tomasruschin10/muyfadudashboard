import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostObjectComponent } from './lost-object.component';

describe('LostObjectComponent', () => {
  let component: LostObjectComponent;
  let fixture: ComponentFixture<LostObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LostObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LostObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
