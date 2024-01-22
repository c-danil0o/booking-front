import {Component, Input} from '@angular/core';
import {Accommodation} from "../../model/accommodation-model";
import {AccommodationService} from "../accommodation.service";
import {PaginatorState} from "primeng/paginator";
import {ListboxChangeEvent, ListboxSelectAllChangeEvent} from "primeng/listbox";
import {SearchFormService} from "../../shared/search-form.service";
import {SearchModel} from "../../model/search-model";
import {CheckboxChangeEvent} from "primeng/checkbox";
import {SearchedAccommodation} from "../../model/searched-accommodation-model";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-filtered-accommodations',
  templateUrl: './filtered-accommodations.component.html',
  styleUrls: ['./filtered-accommodations.component.css']
})
export class FilteredAccommodationsComponent {
  // @Input() props = {startDate: new Date(), endDate: new Date()};

  accommodations: SearchedAccommodation[];
  filteredAccommodations: SearchedAccommodation[];
  currentPage: number = 1;
  rows: number = 3;
  first: number = 0;
  totalItems: number = 0;
  searchForm: SearchModel;
  accommodationTypes: string[] = ["Room", "Apartment", "Hotel"]
  selectedTypes: string[] = [];
  amenities: string[] = ["TV", "Parking", "AC", "Fridge", "Lift", "Pet Friendly", "Kitchen"];
  selected_amenities: string[] = [];
  rangeValues: number[] = [10,400];
  place: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  constructor(private service: AccommodationService, private searchFormService: SearchFormService, private messageService: MessageService){
  }

  ngOnInit(): void{
    this.searchFormService.sharedForms$.subscribe({
      next: (data: SearchModel)=>{
        this.searchForm = data;
      }
    })
    this.place = this.searchForm.place;
    this.startDate = this.searchForm.startDate;
    this.endDate = this.searchForm.endDate;
    this.guests = this.searchForm.guests;

    const reservationDetails = {
      startDate: this.startDate,
      endDate: this.endDate,
      guests: this.guests
    };
    this.service.setFilteredAccommodationDetails(reservationDetails);

    this.service.searchAccommodations(this.searchForm).subscribe({
      next:(data: SearchedAccommodation[]) => {
        this.accommodations = data;
        this.filteredAccommodations=data;
        this.totalItems = data.length
        this.first = (this.currentPage -1 ) * this.rows
      },
      error: (_) => {console.log("error!")}
    })
  }

  search(){
    const today: number = Date.now();
    if (this.startDate != null && this.endDate != null) {
      if (today.valueOf() > this.startDate.valueOf() || today.valueOf() > this.endDate.valueOf() || this.startDate.valueOf() >= this.endDate.valueOf()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          key: 'bc',
          detail: 'Invalid dates!',
          life: 2000
        })
      }
      else {
        this.startDate.setHours(12,0);
        this.endDate.setHours(12,0);
        this.searchForm ={
          place:this.place,
          startDate:this.startDate,
          endDate:this.endDate,
          guests:this.guests
        };
        this.service.searchAccommodations(this.searchForm).subscribe({
          next:(data: SearchedAccommodation[]) => {
            this.accommodations = data;
            this.filteredAccommodations=data;
            this.totalItems = data.length
            this.first = (this.currentPage -1 ) * this.rows
          },
          error: (_) => {console.log("error!")}
        })

        // update details to be passed to accommodation details
        const filteredAccommodationDetails = {
          startDate: this.startDate,
          endDate: this.endDate,
          guests: this.guests
        };
        this.service.setFilteredAccommodationDetails(filteredAccommodationDetails);

      }
    }
  }

  search_text: string;
  items: any;
  selectedItems: any;
  selectAll: any;

  protected readonly length = length;
  onPriceRangeChange() {
    this.filteredAccommodations = this.accommodations;
    this.filterByPrice();
    this.filterByType();
    this.filterByAmenities();
  }


  get paginatedAccommodations(): Array<SearchedAccommodation> {
    return this.filteredAccommodations.slice(this.first, this.first + this.rows
    );
  }

  onPageChange($event: PaginatorState) {
    if ($event.page != null) {
      this.currentPage = $event.page;
    }
    if ($event.rows != null) {
      this.rows = $event.rows
    }
    if ($event.first != null){
      this.first = $event.first
    }
  }

  onAccommodationClicked($event: SearchedAccommodation) {

  }

  onSelectAllChange($event: ListboxSelectAllChangeEvent) {

  }

  onChange($event: ListboxChangeEvent) {

  }
  onCheckTypeChange($event: CheckboxChangeEvent, type: string) {
    if ($event.checked.length === 1) {
      this.selectedTypes.push(type);
      this.filteredAccommodations = this.accommodations;
      this.filterByAmenities();
      this.filterByPrice();
    } else {
      console.log("usao");
      this.filteredAccommodations = this.accommodations;
      this.filterByAmenities();
      this.filterByPrice();
      const index = this.selectedTypes.indexOf(type, 0);
      if (index > -1) {
        this.selectedTypes.splice(index, 1);
      }
    }
    this.filterByType();

  }

  onCheckAmenityChange($event: CheckboxChangeEvent, amenity: string) {
    if ($event.checked.length === 1) {
      this.selected_amenities.push(amenity);
    } else {
      this.filteredAccommodations = this.accommodations;
      this.filterByType();
      this.filterByPrice();
      const index = this.selected_amenities.indexOf(amenity, 0);
      if (index > -1) {
        this.selected_amenities.splice(index, 1);
      }
    }
    this.filterByAmenities();
  }

  filterByType(){
    if(this.selectedTypes.length==0)
      return;
    let newAccommodatins: SearchedAccommodation[] = [];
    for(let i=0; i<this.filteredAccommodations.length;i++){
      if (this.selectedTypes.includes(this.filteredAccommodations[i].accommodationType)){
        newAccommodatins.push(this.filteredAccommodations[i]);
      }
    }
    this.filteredAccommodations = newAccommodatins;
  }

  filterByAmenities(){
    let newAccommodatins: SearchedAccommodation[] = [];
    for(let i=0; i<this.filteredAccommodations.length;i++){
      let isValid: boolean = true;
      for (let amenity of this.selected_amenities) {
        if(!this.filteredAccommodations[i].amenities.includes(amenity)){
          isValid=false;
          break;
        }
      }
      if (isValid)
        newAccommodatins.push(this.filteredAccommodations[i]);
    }
    this.filteredAccommodations = newAccommodatins;
  }

  filterByPrice(){
    let newAccommodatins: SearchedAccommodation[] = [];
    for(let i=0; i<this.filteredAccommodations.length;i++){
      let price: number = this.filteredAccommodations[i].pricePerNight;
      if (price>=this.rangeValues[0] && price <= this.rangeValues[1]){
        newAccommodatins.push(this.filteredAccommodations[i]);
      }
      else if (this.rangeValues[1]==400 && price >400)
        newAccommodatins.push(this.filteredAccommodations[i]);

    }
    this.filteredAccommodations = newAccommodatins;
  }
}
