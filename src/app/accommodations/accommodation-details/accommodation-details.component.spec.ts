import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccommodationDetailsComponent} from './accommodation-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule, By} from "@angular/platform-browser";
import {MessageService} from "primeng/api";
import {MessageModule} from "primeng/message";
import {AccommodationService} from "../accommodation.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {AccommodationsModule} from "../accommodations.module";
import {AccommodationStatus} from "../../model/accommodation-status-model";
import {Address} from "../../model/address-model";
import {Host} from "../../model/host-model";
import {GottenAvailabilityPrice} from "../../model/gotten-availability-price-model";
import {of} from "rxjs";
import {mockAccommodation} from "../../mocks/accommodation.mock";
import {mockGottenAvailabilityPrice} from "../../mocks/getAvailabilityPrice.mock";


describe('AccommodationPageComponent', () => {
  let component: AccommodationDetailsComponent;
  let fixture: ComponentFixture<AccommodationDetailsComponent>;
  let reserveButton: HTMLElement;

  beforeEach(() => {
    const accommodationServiceSpy = jasmine.createSpyObj<AccommodationService>(['checkAvailabilityAndPrice']);
    accommodationServiceSpy.checkAvailabilityAndPrice.and.returnValue(of(mockGottenAvailabilityPrice));
    TestBed.configureTestingModule({
      declarations: [AccommodationDetailsComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        RouterTestingModule,
        HttpClientModule,
        CalendarModule,
        InputNumberModule,
      ],
      providers: [
        { provide: MessageService },
        { provide: HttpClient },
        { provide: AccommodationService, useValue: accommodationServiceSpy },
      ]
    });

  });

  beforeEach( () => {
    fixture = TestBed.createComponent(AccommodationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid because guests is empty', () => {
    component.reservation_form.controls['guests'].setValue('');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    expect(component.reservation_form.valid).toBeFalsy();
  });
  it('form should be invalid because startDate is empty', () => {
    component.reservation_form.controls['startDate'].setValue('');
    component.reservation_form.controls['guests'].setValue('3');
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    expect(component.reservation_form.valid).toBeFalsy();
  });
  it('form should be invalid because endDate is empty', () => {
    component.reservation_form.controls['endDate'].setValue('');
    component.reservation_form.controls['guests'].setValue('3');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    expect(component.reservation_form.valid).toBeFalsy();
  });

  it('form should be filled', () => {
    component.reservation_form.controls['guests'].setValue('3');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    expect(component.reservation_form.valid).toBeTruthy();
  });

  it('form should be invalid because startDate is after endDate', () => {
    spyOn(component, 'onSubmit');
    component.isGuest = true;
    component.accommodation = mockAccommodation;
    fixture.detectChanges();
    reserveButton = fixture.debugElement.query(By.css('#reserveButton')).nativeElement;
    component.reservation_form.controls['guests'].setValue('3');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 2));
    reserveButton.click();
    expect(component.reservation_form.valid).toBeTruthy();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid because number of guests is less than 1', () => {
    spyOn(component, 'onSubmit');
    component.isGuest = true;
    component.accommodation = mockAccommodation;
    fixture.detectChanges();
    reserveButton = fixture.debugElement.query(By.css('#reserveButton')).nativeElement;
    component.reservation_form.controls['guests'].setValue('0');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    reserveButton.click();
    expect(component.reservation_form.valid).toBeTruthy();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid because number of guests is more than accommodation max', () => {
    spyOn(component, 'onSubmit');
    component.isGuest = true;
    component.accommodation = mockAccommodation;
    fixture.detectChanges();
    reserveButton = fixture.debugElement.query(By.css('#reserveButton')).nativeElement;
    component.reservation_form.controls['guests'].setValue('10');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    reserveButton.click();
    expect(component.reservation_form.valid).toBeTruthy();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid because number of guests is less than accommodation min', () => {
    spyOn(component, 'onSubmit');
    component.isGuest = true;
    component.accommodation = mockAccommodation;
    fixture.detectChanges();
    reserveButton = fixture.debugElement.query(By.css('#reserveButton')).nativeElement;
    component.reservation_form.controls['guests'].setValue('1');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    reserveButton.click();
    expect(component.reservation_form.valid).toBeTruthy();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  });

  it('form should be valid', () => {
    spyOn(component, 'onSubmit');
    component.isGuest = true;
    component.accommodation = mockAccommodation;
    console.log(component.isGuest);
    fixture.detectChanges();
    reserveButton = fixture.debugElement.query(By.css('#reserveButton')).nativeElement;
    component.reservation_form.controls['guests'].setValue('3');
    component.reservation_form.controls['startDate'].setValue(new Date(2024,2,5));
    component.reservation_form.controls['endDate'].setValue(new Date(2024, 2, 10));
    reserveButton.click();
    expect(component.reservation_form.valid).toBeTruthy();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });


});
