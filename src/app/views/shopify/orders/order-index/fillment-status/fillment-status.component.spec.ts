import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillmentStatusComponent } from './fillment-status.component';

describe('FillmentStatusComponent', () => {
  let component: FillmentStatusComponent;
  let fixture: ComponentFixture<FillmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillmentStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
