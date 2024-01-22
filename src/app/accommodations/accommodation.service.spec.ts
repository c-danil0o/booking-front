import { AccommodationService } from './accommodation.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {mockAvailabilityPrice} from "../mocks/getAvailabilityPrice.mock";
import {environment} from "../../env/env";
import {mockReservation1} from "../mocks/reservation.service.mock";
import {mockGottenAvailabilityPrice} from "../mocks/getAvailabilityPrice.mock";

describe('AccommodationService', () => {
  let service: AccommodationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AccommodationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })


  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should send and get back availability and prices', () => {
    service.checkAvailabilityAndPrice(mockAvailabilityPrice).subscribe((data) => {
      expect(data).toEqual(mockGottenAvailabilityPrice);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: environment.apiHost + 'api/accommodations/get-availability-price',
    });

    req.flush(mockGottenAvailabilityPrice);

  });
});
