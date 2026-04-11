import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOutIndexPageComponent } from './inventory-out-index-page.component';

describe('InventoryOutIndexPageComponent', () => {
  let component: InventoryOutIndexPageComponent;
  let fixture: ComponentFixture<InventoryOutIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOutIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOutIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
