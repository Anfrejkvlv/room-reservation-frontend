/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoomReservationService } from './room-reservation.service';

describe('Service: RoomReservation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomReservationService]
    });
  });

  it('should ...', inject([RoomReservationService], (service: RoomReservationService) => {
    expect(service).toBeTruthy();
  }));
});
