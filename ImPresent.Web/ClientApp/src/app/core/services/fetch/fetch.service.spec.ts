import { TestBed } from '@angular/core/testing';

import { FetchService } from './fetch.service';

describe('StateService', () => {
  let service: FetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
