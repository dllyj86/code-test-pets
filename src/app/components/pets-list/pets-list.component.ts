import { GenderEnum } from './../../models/gender';
import { Pet } from './../../models/Pet';
import { PetsListService } from './../../services/pets-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GroupedPetsInterface } from 'src/app/models/groupedpetsinterface';

@Component({
  selector: 'app-pets-list',
  templateUrl: './pets-list.component.html',
  styleUrls: ['./pets-list.component.scss']
})
export class PetsListComponent implements OnInit, OnDestroy {

  petsWithMaleOwner: Array<Pet>;

  petsWithFemaleOwner: Array<Pet>;

  loadPets$: Subscription;

  constructor(private petsListService: PetsListService) { }

  ngOnInit() {
    this.petsListService.loadPets().subscribe((groupedPets: GroupedPetsInterface) => {
      this.petsWithMaleOwner = groupedPets[GenderEnum.MALE];
      this.petsWithFemaleOwner = groupedPets[GenderEnum.FEMALE];
    });
  }

  ngOnDestroy() {
    if(this.loadPets$) {
      this.loadPets$.unsubscribe();
    }
  }
}
