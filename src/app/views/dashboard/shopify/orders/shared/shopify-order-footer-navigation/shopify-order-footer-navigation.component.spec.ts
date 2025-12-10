import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderFooterNavigationComponent } from './shopify-order-footer-navigation.component';

describe('ShopifyOrderFooterNavigationComponent', () => {
  let component: ShopifyOrderFooterNavigationComponent;
  let fixture: ComponentFixture<ShopifyOrderFooterNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderFooterNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderFooterNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
