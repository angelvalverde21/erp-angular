import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyAddressComponent } from './shopify-address.component';

describe('ShopifyAddressComponent', () => {
  let component: ShopifyAddressComponent;
  let fixture: ComponentFixture<ShopifyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
