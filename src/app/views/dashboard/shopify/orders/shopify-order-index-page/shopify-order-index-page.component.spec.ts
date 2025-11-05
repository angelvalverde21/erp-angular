import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderIndexPageComponent } from './shopify-order-index-page.component';

describe('ShopifyOrderIndexPageComponent', () => {
  let component: ShopifyOrderIndexPageComponent;
  let fixture: ComponentFixture<ShopifyOrderIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
