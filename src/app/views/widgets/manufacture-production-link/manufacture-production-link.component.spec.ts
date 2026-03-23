import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionLinkComponent } from './manufacture-production-link.component';

describe('ManufactureProductionLinkComponent', () => {
  let component: ManufactureProductionLinkComponent;
  let fixture: ComponentFixture<ManufactureProductionLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
