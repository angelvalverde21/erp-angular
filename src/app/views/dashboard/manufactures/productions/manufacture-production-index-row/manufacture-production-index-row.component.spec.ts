import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionIndexRowComponent } from './manufacture-production-index-row.component';

describe('ManufactureProductionIndexRowComponent', () => {
  let component: ManufactureProductionIndexRowComponent;
  let fixture: ComponentFixture<ManufactureProductionIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
