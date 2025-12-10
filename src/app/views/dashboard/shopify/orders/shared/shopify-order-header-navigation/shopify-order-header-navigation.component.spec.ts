import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderHeaderNavigationComponent } from './shopify-order-header-navigation.component';

describe('ShopifyOrderHeaderNavigationComponent', () => {
  let component: ShopifyOrderHeaderNavigationComponent;
  let fixture: ComponentFixture<ShopifyOrderHeaderNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderHeaderNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderHeaderNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
