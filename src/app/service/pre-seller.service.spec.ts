import { TestBed } from '@angular/core/testing';

import { PreSellerService } from './pre-seller.service';

describe('PreSellerService', () => {
  let service: PreSellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreSellerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
