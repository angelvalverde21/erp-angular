import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProgressBarComponent } from './manufacture-progress-bar.component';

describe('ManufactureProgressBarComponent', () => {
  let component: ManufactureProgressBarComponent;
  let fixture: ComponentFixture<ManufactureProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
