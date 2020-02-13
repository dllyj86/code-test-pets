import { GenderEnum } from './../../models/gender';
import { Pet } from './../../models/Pet';
import { PetsListService } from './../../services/pets-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { GroupedPetsInterface } from 'src/app/models/groupedpetsinterface';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-pets-list',
  templateUrl: './pets-list.component.html',
  styleUrls: ['./pets-list.component.scss']
})
export class PetsListComponent implements OnInit, OnDestroy {

  petsWithMaleOwner: Array<Pet>;

  petsWithFemaleOwner: Array<Pet>;

  loadPetsSub: Subscription;

  loadPetsTrigger = new Subject<boolean>();
  triggerSub: Subscription;

  // Impact spinner
  isLoading = false;
  // Impact pets list
  isLoaded = false;
  // Impact error message and pets list
  isFailed = false;

  errorMessage: string;

  constructor(private petsListService: PetsListService) { }

  ngOnInit() {
    this.triggerSub = this.loadPetsTrigger.subscribe(shouldLoad => {
      if(shouldLoad) {
        this.setPageForLoading();
        this.petsListService.loadPets().subscribe((groupedPets: GroupedPetsInterface) => {
          if(groupedPets) {
            this.petsWithMaleOwner = groupedPets[GenderEnum.MALE];
            this.petsWithFemaleOwner = groupedPets[GenderEnum.FEMALE];
            this.setPageForLoaded(false);
          } else {
            this.errorMessage = 'Load pets failed.';
            this.setPageForLoaded(true);
          }
        });
      }
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
    this.loadPetsTrigger.next(true);
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
