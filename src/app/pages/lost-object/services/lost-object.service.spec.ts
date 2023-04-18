import { TestBed } from '@angular/core/testing';

import { LostObjectService } from './lost-object.service';

describe('LostObjectService', () => {
  let service: LostObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LostObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
