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
    const petsList = service.convertResToPetsArray(rawApiResponse);
    expect(petsList.length).toBe(petsArray.length);
  })

  it('should get empty array with invalid response', () => {
    const petsList = service.convertResToPetsArray(null);
    expect(petsList.length).toBe(0);
  })

  // Test groupPets
  it('should get grouped pest', () => {
    const groupedPets = service.groupPets(petsArray);
    expect(Object.keys(groupedPets).length).toBe(2);
  })

  it('should be empty object', () => {
    let groupedPets = service.groupPets([]);
    expect(Object.keys(groupedPets).length).toBe(0);

    groupedPets = service.groupPets(null);
    expect(Object.keys(groupedPets).length).toBe(0);
  })

});
