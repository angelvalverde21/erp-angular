import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressIndexPageComponent } from './address-index-page.component';

describe('AddressIndexPageComponent', () => {
  let component: AddressIndexPageComponent;
  let fixture: ComponentFixture<AddressIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
