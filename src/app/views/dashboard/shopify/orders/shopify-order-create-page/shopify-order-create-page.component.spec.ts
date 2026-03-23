import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderCreatePageComponent } from './shopify-order-create-page.component';

describe('ShopifyOrderCreatePageComponent', () => {
  let component: ShopifyOrderCreatePageComponent;
  let fixture: ComponentFixture<ShopifyOrderCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
