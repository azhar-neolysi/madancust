import { TestBed } from '@angular/core/testing';

import { MyBookingsService } from './my-booking.service';

describe('MyBookingService', () => {
  let service: MyBookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyBookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
