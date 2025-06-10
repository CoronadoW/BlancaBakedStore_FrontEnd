import { TestBed } from '@angular/core/testing';

import { AuthIntentService } from './auth-intent.service';

describe('AuthIntentService', () => {
  let service: AuthIntentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthIntentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
