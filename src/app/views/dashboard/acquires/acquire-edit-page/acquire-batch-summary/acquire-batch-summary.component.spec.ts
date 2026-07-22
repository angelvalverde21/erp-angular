import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireBatchSummaryComponent } from './acquire-batch-summary.component';

describe('AcquireBatchSummaryComponent', () => {
  let component: AcquireBatchSummaryComponent;
  let fixture: ComponentFixture<AcquireBatchSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireBatchSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireBatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
