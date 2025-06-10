import { TestBed } from '@angular/core/testing';

import { ResaleProductService } from './resale-product.service';

describe('ResaleProductService', () => {
  let service: ResaleProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResaleProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
