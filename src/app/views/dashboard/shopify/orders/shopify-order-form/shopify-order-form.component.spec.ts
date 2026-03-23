import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderFormComponent } from './shopify-order-form.component';

describe('ShopifyOrderFormComponent', () => {
  let component: ShopifyOrderFormComponent;
  let fixture: ComponentFixture<ShopifyOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
