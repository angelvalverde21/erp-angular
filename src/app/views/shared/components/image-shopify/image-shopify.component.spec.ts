import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageShopifyComponent } from './image-shopify.component';

describe('ImageShopifyComponent', () => {
  let component: ImageShopifyComponent;
  let fixture: ComponentFixture<ImageShopifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageShopifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageShopifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
