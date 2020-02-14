import { GenderEnum } from './../models/gender';
import { environment } from './../../environments/environment.prod';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PetsListService } from './pets-list.service';

const rawApiResponse = require('./api-response-mock.json');
const petsArray: Array<any> = require('./pets-array-mock.json');

describe('PetsListService', () => {

  let service: PetsListService;
  let testingController: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetsListService]
    }).compileComponents()
  });

  beforeEach(() => {
    testingController = TestBed.get(HttpTestingController);
    service = TestBed.get(PetsListService);
  })

  // Run whole processing
  it('should get grouped pests', async () => {

    expect(service).toBeTruthy();

    service.loadPets().subscribe(groupedPets => {
      expect(Object.keys(groupedPets).length).toBe(2);
    });

    const req = testingController.expectOne(environment.PETS_API_URL);
    expect(req.request.method).toEqual('GET');
    req.flush(rawApiResponse);
  })

  // Test loadPets
  it('should get empty response with invalid respose', () => {
    const petsList = service.loadPets().subscribe(groupedPets => {
      expect(groupedPets).toBe(null);
    })

    const req = testingController.expectOne(environment.PETS_API_URL);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  })

  // Call api error
  it('should get empty response when calling api error', () => {
    const petsList = service.loadPets().subscribe(groupedPets => {
      expect(groupedPets).toBe(null);
    })

    const req = testingController.expectOne(environment.PETS_API_URL);
    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('error'), {
      status: 404
    });
  })

  // Test convertResToPetsArray
  it('should convert respones to pets array', () => {
    const petsList = service.convertResToGroupedPets(rawApiResponse);
    expect(petsList.length).toBe(2);
    expect(petsList[0].groupKey).toBe(GenderEnum.MALE);
    expect(petsList[0].groupValues.length).toBe(4);
    expect(petsList[1].groupKey).toBe(GenderEnum.FEMALE);
    expect(petsList[1].groupValues.length).toBe(3);
  })

  it('should get empty array with invalid response', () => {
    const petsList = service.convertResToGroupedPets(null);
    expect(petsList).toBe(null);
  })

  it('should filter correctly', () => {

    const list = [
      {type: 'dog', name: 'dog 1', owner: null},
      {type: 'dog', name: 'dog 2', owner: null},
      {type: 'dog', name: 'dog 3', owner: null},
      {type: 'dog', name: 'dog 3', owner: null},
      {type: 'cat', name: 'cat 1', owner: null},
      {type: 'cat', name: 'dog 3', owner: null},
    ]

    let filteredList = service.filterPetsByValue(list, 'type', 'dog');
    expect(filteredList.length).toBe(4);

    filteredList = service.filterPetsByValue(list, 'name', 'dog 3');
    expect(filteredList.length).toBe(3);
  })

  it('should sort correctly', () => {
    const list = [
      {type: 'dog', name: 'dog 1', owner: null},
      {type: 'dog', name: 'dog 2', owner: null},
      {type: 'dog', name: 'dog 3', owner: null},
      {type: 'dog', name: 'dog 3', owner: null},
      {type: 'cat', name: 'cat 1', owner: null},
      {type: 'cat', name: 'dog 3', owner: null}
    ]

    service.sortPetsList(list, 'name');

    expect(list[0].name).toEqual('cat 1');
    expect(list[1].name).toEqual('dog 1');
    expect(list[3].name).toEqual('dog 3');
    expect(list[5].name).toEqual('dog 3');

    service.sortPetsList(list, 'name', 'desc');
    expect(list[0].name).toEqual('dog 3');
    expect(list[2].name).toEqual('dog 3');
    expect(list[4].name).toEqual('dog 1');
    expect(list[5].name).toEqual('cat 1');
  })
});
