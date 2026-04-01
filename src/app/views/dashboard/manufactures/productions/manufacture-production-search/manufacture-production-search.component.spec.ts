import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionSearchComponent } from './manufacture-production-search.component';

describe('ManufactureProductionSearchComponent', () => {
  let component: ManufactureProductionSearchComponent;
  let fixture: ComponentFixture<ManufactureProductionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
