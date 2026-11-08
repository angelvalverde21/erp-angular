import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderEditComponent } from './shopify-order-edit.component';

describe('ShopifyOrderEditComponent', () => {
  let component: ShopifyOrderEditComponent;
  let fixture: ComponentFixture<ShopifyOrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
