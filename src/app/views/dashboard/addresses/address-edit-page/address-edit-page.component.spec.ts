import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressEditPageComponent } from './address-edit-page.component';

describe('AddressEditPageComponent', () => {
  let component: AddressEditPageComponent;
  let fixture: ComponentFixture<AddressEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
