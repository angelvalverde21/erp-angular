import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseEditPageComponent } from './purchase-edit-page.component';

describe('PurchaseEditPageComponent', () => {
  let component: PurchaseEditPageComponent;
  let fixture: ComponentFixture<PurchaseEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
