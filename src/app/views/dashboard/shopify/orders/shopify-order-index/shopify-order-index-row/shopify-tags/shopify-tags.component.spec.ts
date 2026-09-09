import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyTagsComponent } from './shopify-tags.component';

describe('ShopifyTagsComponent', () => {
  let component: ShopifyTagsComponent;
  let fixture: ComponentFixture<ShopifyTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyTagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
