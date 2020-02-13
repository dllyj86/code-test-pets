import { environment } from './../../environments/environment';
import { GroupedPetsInterface } from './../models/groupedpetsinterface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pet } from '../models/Pet';
import { Owner } from '../models/Owner';
import * as _ from 'lodash';

/**
 * Pets list service.
 */
@Injectable({
  providedIn: 'root'
})
export class PetsListService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Call api.
   */
  loadPetsList(): Observable<any> {
    return this.httpClient.get(environment.PETS_API_URL).pipe(map<any, Array<Pet>>((response) => {
      console.log(response);

      return response;
    }),
    catchError(error => {
      console.error('Load pets got error: ' + JSON.stringify(error));
      return of([]);
    }));
  }

  /**
   * Load pets and handle the response.
   */
  loadPets(): Observable<GroupedPetsInterface> {

    return this.loadPetsList().pipe(map<any, GroupedPetsInterface>(response => {

      if(Array.isArray(response) && response.length > 0) {
        const petsArray = this.convertResToPetsArray(response);
        const groupedPets = this.groupPets(petsArray);

        console.log(JSON.stringify(groupedPets));

        return groupedPets;
      } else {
        return null;
      }
    }));
  }

  /**
   * Convert response owner array to pets array.
   * @param response
   */
  convertResToPetsArray(response: any): Array<Pet> {

    const petsArray = [];

    if(Array.isArray(response)) {
      const originalPetsList = response as Array<any>;
      for(const orignalData of originalPetsList){
        const owner = new Owner(orignalData['name'], orignalData['gender'], orignalData['age']);
        const petsLists = orignalData['pets'];

        if(Array.isArray(petsLists)){
          for(const orignalPet of petsLists){
            const pet = new Pet(orignalPet['name'], orignalPet['type'], owner);
            petsArray.push(pet);
          }
        }
      }

      return petsArray;
    }else{
      return [];
    }
  }

  /**
   * Generate object that contains pets.
   * Pets are grouped by owner's gender.
   * @param petsArray
   */
  groupPets(petsArray: Array<Pet>): GroupedPetsInterface {
    const groupedPets: GroupedPetsInterface = _.groupBy(petsArray, (pet: Pet) => {
      return pet.owner.gender;
    });
    return groupedPets;
  }
}
