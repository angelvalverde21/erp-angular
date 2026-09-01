import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCreatePageComponent } from './inventory-create-page.component';

describe('InventoryCreatePageComponent', () => {
  let component: InventoryCreatePageComponent;
  let fixture: ComponentFixture<InventoryCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
