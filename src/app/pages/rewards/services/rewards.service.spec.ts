import { TestBed } from '@angular/core/testing';

import { AdPageService } from './rewards.service';

describe('AdPageService', () => {
  let service: AdPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
