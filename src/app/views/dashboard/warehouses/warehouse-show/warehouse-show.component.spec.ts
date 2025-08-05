import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseShowComponent } from './warehouse-show.component';

describe('WarehouseShowComponent', () => {
  let component: WarehouseShowComponent;
  let fixture: ComponentFixture<WarehouseShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
