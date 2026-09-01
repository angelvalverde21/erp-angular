import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionSearchPageComponent } from './manufacture-production-search-page.component';

describe('ManufactureProductionSearchPageComponent', () => {
  let component: ManufactureProductionSearchPageComponent;
  let fixture: ComponentFixture<ManufactureProductionSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
