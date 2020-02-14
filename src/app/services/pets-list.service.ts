import { GenderEnum } from './../models/gender';
import { environment } from './../../environments/environment';
import { GroupedPetsInterface } from './../models/groupedpetsinterface';
import { Injectable } from '@angular/core';
import { HttpClient, JsonpInterceptor } from '@angular/common/http';
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
  loadPetsFromApi(): Observable<any> {
    return this.httpClient.get(environment.PETS_API_URL).pipe(map<any, Array<Pet>>((response) => {
      return response;
    }),
    catchError(error => {
      console.error('Load pets got error: ' + JSON.stringify(error));
      return of(null);
    }));
  }

  /**
   * Load pets and handle the response.
   */
  loadPets(): Observable<Array<GroupedPetsInterface> | null> {

    return this.loadPetsFromApi().pipe(map<any, Array<GroupedPetsInterface>>(response => {

      if(Array.isArray(response) && response.length > 0) {

        const groupedPets = this.convertResToGroupedPets(response);

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
  convertResToGroupedPets(response: any): Array<GroupedPetsInterface> {

    if(Array.isArray(response)) {

      let maleList = [];
      let femaleList = [];

      const originalPetsList = response as Array<any>;

      // Loop top level owner first
      for(const orignalData of originalPetsList){

        const petsLists = orignalData['pets'];

        if(orignalData['gender'] === GenderEnum.MALE) {
          maleList = maleList.concat(this.filterPetsByValue(petsLists, 'type', 'Cat'));
        } else {
          femaleList = femaleList.concat(this.filterPetsByValue(petsLists, 'type', 'Cat'));
        }
      }
      // Sort by name
      this.sortPetsList(maleList, 'name');
      this.sortPetsList(femaleList, 'name');

      const groupedPets = [
        {groupKey: GenderEnum.MALE, groupValues: maleList},
        {groupKey: GenderEnum.FEMALE, groupValues: femaleList}
      ];

      return groupedPets;
    }else{
      return null;
    }
  }

  /**
   * If want to sort the data desc, need to pass 'desc' in order parameter.
   * @param petsArray input array
   * @param sortKey property key of the data
   * @param order optional, desc will make desc sort
   */
  sortPetsList(petsArray: Array<Pet>, sortKey: string, order?: string) {

    const orderFactor = 'desc' === order ? -1 : 1;

    petsArray.sort((pet1: Pet, pet2: Pet) => {
      return orderFactor * (pet1[sortKey] < pet2[sortKey] ? -1 : (pet1[sortKey] === pet2[sortKey] ? 0 : 1 ) );
    })
  }

  /**
   * Filter data by key and value.
   * Pass the valid key and value to get the valid data.
   * @param petsLists input array
   * @param filterKey property key
   * @param filterValue property value
   */
  filterPetsByValue(petsLists: Array<Pet>, filterKey: string, filterValue: string): Array<Pet> {
    return _.filter(petsLists, (orgPet: Pet) => {
      // Only show cats
      if(orgPet[filterKey] === filterValue) {
        return true;
      } else {
        return false;
      }
    });
  }

}
