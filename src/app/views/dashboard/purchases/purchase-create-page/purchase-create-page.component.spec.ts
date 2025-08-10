import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCreatePageComponent } from './purchase-create-page.component';

describe('PurchaseCreatePageComponent', () => {
  let component: PurchaseCreatePageComponent;
  let fixture: ComponentFixture<PurchaseCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
