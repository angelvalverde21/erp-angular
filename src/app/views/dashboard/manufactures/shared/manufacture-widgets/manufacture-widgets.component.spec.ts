import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureWidgetsComponent } from './manufacture-widgets.component';

describe('ManufactureWidgetsComponent', () => {
  let component: ManufactureWidgetsComponent;
  let fixture: ComponentFixture<ManufactureWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureWidgetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
