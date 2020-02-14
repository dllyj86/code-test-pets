import { PetsListService } from './../../services/pets-list.service';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsListComponent } from './pets-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupedPetsInterface } from 'src/app/models/groupedpetsinterface';
import { of } from 'rxjs';

const groupedPetsData: Array<GroupedPetsInterface> = require('./grouped-pets-mock.json');

describe('PetsListComponent', () => {
  let component: PetsListComponent;
  let fixture: ComponentFixture<PetsListComponent>;
  let service: PetsListService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PetsListService],
      declarations: [ PetsListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(PetsListService);
    fixture = TestBed.createComponent(PetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test setPageForLoading
  it('should set flags correctly for loading', () => {
    component.setPageForLoading();
    fixture.detectChanges();
    expect(component.isLoaded).toBe(false);
    expect(component.isLoading).toBe(true);
    expect(component.isFailed).toBe(false);
  })

  // Test setPageForLoaded
  it('should set flags correctly for loaded', () => {
    component.setPageForLoaded(true);
    fixture.detectChanges();

    expect(component.isLoaded).toBe(true);
    expect(component.isLoading).toBe(false);
    expect(component.isFailed).toBe(true);

    component.setPageForLoaded(false);
    fixture.detectChanges();

    expect(component.isLoaded).toBe(true);
    expect(component.isLoading).toBe(false);
    expect(component.isFailed).toBe(false);
  })

  // Click button should load pets
  it('should trigger loadPestList', async () => {
    spyOn(component, 'loadPestList').and.callThrough();
    spyOn(component.loadPetsTrigger, 'next').and.returnValue();

    getEl('.show-pets-list-button').click();
    fixture.detectChanges();

    expect(component.loadPestList).toHaveBeenCalled();
    expect(component.loadPetsTrigger.next).toHaveBeenCalled();
  })

  // Should show pets in page
  it('should show correct labels in page with correct pets data', async () => {
    spyOn(service, 'loadPets').and.returnValue(of(groupedPetsData));
    spyOn(component, 'setPageForLoading').and.callThrough();
    spyOn(component, 'setPageForLoaded').and.callThrough();

    const button = getEl('.show-pets-list-button');
    button.click();

    fixture.detectChanges();
    expect(service.loadPets).toHaveBeenCalled();
    expect(component.setPageForLoading).toHaveBeenCalled();
    expect(component.setPageForLoaded).toHaveBeenCalledWith(false);

    expect(getElList('.pet-li').length).toBe(7);
  })

  it('should hide button and show spinner when loading', async () => {
    spyOn(service, 'loadPets').and.returnValue(of(groupedPetsData));
    spyOn(component, 'setPageForLoaded').and.callFake(() => {});

    let button = getEl('.show-pets-list-button');
    button.click();
    fixture.detectChanges();

    button = getEl('.show-pets-list-button');
    expect(button).toBe(null);

    const spinner = getEl('mat-spinner');
    expect(spinner).not.toBe(null);
  })

  // Should show error message
  it('should show error message', async () => {
    spyOn(service, 'loadPets').and.returnValue(of(null));
    spyOn(component, 'setPageForLoading').and.callThrough();
    spyOn(component, 'setPageForLoaded').and.callThrough();

    const button = getEl('.show-pets-list-button');
    button.click();

    fixture.detectChanges();
    expect(service.loadPets).toHaveBeenCalled();
    expect(component.setPageForLoading).toHaveBeenCalled();
    expect(component.setPageForLoaded).toHaveBeenCalledWith(true);

    expect(getEl('.error-message')).not.toBeNull();
    expect(getEl('.pets-list')).toBeNull();
  })

  // should unsubscribe when destroy component
  it('should unsubscribe Subscription properties', async () => {

    spyOn(component, 'setPageForLoaded').and.callThrough();
    spyOn(service, 'loadPets').and.returnValue(of(groupedPetsData));

    const button = getEl('.show-pets-list-button');
    button.click();
    fixture.detectChanges();

    expect(component.setPageForLoaded).toHaveBeenCalledWith(false);

    spyOn(component.loadPetsSub, 'unsubscribe').and.callThrough();
    spyOn(component.triggerSub, 'unsubscribe').and.callThrough();

    component.ngOnDestroy();
    expect(component.loadPetsSub.unsubscribe).toHaveBeenCalled();
    expect(component.triggerSub.unsubscribe).toHaveBeenCalled();

  })

  /**
   * Get single element
   * @param selectorText single element
   */
  function getEl(selectorText: string): any {
    const el = fixture.debugElement.nativeElement;
    return el.querySelector(selectorText);
  }

  /**
   * Get array of elements
   * @param selectorText array of elements
   */
  function getElList(selectorText: string): Array<any> {
    const el = fixture.debugElement.nativeElement;
    return el.querySelectorAll(selectorText);
  }
});
