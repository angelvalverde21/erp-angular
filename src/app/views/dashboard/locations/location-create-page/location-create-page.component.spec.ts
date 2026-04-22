import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCreatePageComponent } from './location-create-page.component';

describe('LocationCreatePageComponent', () => {
  let component: LocationCreatePageComponent;
  let fixture: ComponentFixture<LocationCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
