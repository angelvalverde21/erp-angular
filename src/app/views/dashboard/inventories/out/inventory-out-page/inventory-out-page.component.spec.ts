import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOutPageComponent } from './inventory-out-page.component';

describe('InventoryOutPageComponent', () => {
  let component: InventoryOutPageComponent;
  let fixture: ComponentFixture<InventoryOutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOutPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
