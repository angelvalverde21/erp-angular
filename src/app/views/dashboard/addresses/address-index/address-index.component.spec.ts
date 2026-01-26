import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressIndexComponent } from './address-index.component';

describe('AddressIndexComponent', () => {
  let component: AddressIndexComponent;
  let fixture: ComponentFixture<AddressIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
