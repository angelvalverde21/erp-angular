import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationIndexPageComponent } from './location-index-page.component';

describe('LocationIndexPageComponent', () => {
  let component: LocationIndexPageComponent;
  let fixture: ComponentFixture<LocationIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
