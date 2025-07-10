import { TestBed } from '@angular/core/testing';

import { SlugBaseService } from './slug-base.service';

describe('SlugBaseService', () => {
  let service: SlugBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlugBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
