import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryIndexPageComponent } from './inventory-index-page.component';

describe('InventoryIndexPageComponent', () => {
  let component: InventoryIndexPageComponent;
  let fixture: ComponentFixture<InventoryIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
