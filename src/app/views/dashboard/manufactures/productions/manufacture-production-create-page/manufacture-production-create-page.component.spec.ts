import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionCreatePageComponent } from './manufacture-production-create-page.component';

describe('ManufactureProductionCreatePageComponent', () => {
  let component: ManufactureProductionCreatePageComponent;
  let fixture: ComponentFixture<ManufactureProductionCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
