import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderCreateComponent } from './shopify-order-create.component';

describe('ShopifyOrderCreateComponent', () => {
  let component: ShopifyOrderCreateComponent;
  let fixture: ComponentFixture<ShopifyOrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
