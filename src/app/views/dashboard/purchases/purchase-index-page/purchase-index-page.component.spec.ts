import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseIndexPageComponent } from './purchase-index-page.component';

describe('PurchaseIndexPageComponent', () => {
  let component: PurchaseIndexPageComponent;
  let fixture: ComponentFixture<PurchaseIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
