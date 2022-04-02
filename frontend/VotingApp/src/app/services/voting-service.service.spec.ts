import { TestBed } from '@angular/core/testing';

import { VotingServiceService } from './voting-service.service';

describe('VotingServiceService', () => {
  let service: VotingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
