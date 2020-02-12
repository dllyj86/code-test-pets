import { TestBed } from '@angular/core/testing';

import { PetsListService } from './pets-list.service';

describe('PetsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PetsListService = TestBed.get(PetsListService);
    expect(service).toBeTruthy();
  });
});
