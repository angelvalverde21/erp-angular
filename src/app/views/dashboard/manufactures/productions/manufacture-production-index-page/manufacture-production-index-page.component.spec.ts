import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionIndexPageComponent } from './manufacture-production-index-page.component';

describe('ManufactureProductionIndexPageComponent', () => {
  let component: ManufactureProductionIndexPageComponent;
  let fixture: ComponentFixture<ManufactureProductionIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
