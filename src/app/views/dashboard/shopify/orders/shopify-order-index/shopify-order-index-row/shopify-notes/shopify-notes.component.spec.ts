import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyNotesComponent } from './shopify-notes.component';

describe('ShopifyNotesComponent', () => {
  let component: ShopifyNotesComponent;
  let fixture: ComponentFixture<ShopifyNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
