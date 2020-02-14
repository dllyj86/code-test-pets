import { PetsListService } from './../../services/pets-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { GroupedPetsInterface } from 'src/app/models/groupedpetsinterface';

@Component({
  selector: 'app-pets-list',
  templateUrl: './pets-list.component.html',
  styleUrls: ['./pets-list.component.scss']
})
export class PetsListComponent implements OnInit, OnDestroy {
  // Keep all valid pets data
  groupedPetsList: Array<GroupedPetsInterface>;

  loadPetsSub: Subscription;
  triggerSub: Subscription;

  // Used by show pets list button
  loadPetsTrigger = new Subject<boolean>();
  // button label
  showListButtonLabel = 'Load pets list.';

  // Impact spinner
  isLoading = false;
  // Impact pets list
  isLoaded = false;
  // Impact error message and pets list
  isFailed = false;

  errorMessage: string;

  constructor(private petsListService: PetsListService) { }

  ngOnInit() {
    this.triggerSub = this.loadPetsTrigger.subscribe(value => {
      this.setPageForLoading();
      this.loadPetsSub = this.petsListService.loadPets().subscribe((groupedPets: Array<GroupedPetsInterface>) => {
        if(groupedPets) {
          this.groupedPetsList = groupedPets;
          this.setPageForLoaded(false);
        } else {
          this.errorMessage = 'Load pets failed.';
          this.setPageForLoaded(true);
        }
      });
    });
  }

  ngOnDestroy() {
    if(this.loadPetsSub) {
      this.loadPetsSub.unsubscribe();
    }

    if(this.triggerSub) {
      this.triggerSub.unsubscribe();
    }
  }

  /**
   * Trigger load pest list logic.
   */
  loadPestList(){
    this.loadPetsTrigger.next();
  }

  /**
   * Set flags for UI when loading pets.
   */
  setPageForLoading() {
    this.isLoading = true;
    this.isLoaded = false;
    this.isFailed = false;
  }

  /**
   * Set flags for UI when loaded pages
   * @param isLoadFailed if loading is failed
   */
  setPageForLoaded(isLoadFailed: boolean){
    this.isLoading = false;
    this.isLoaded = true;
    this.isFailed = isLoadFailed;
  }
}
