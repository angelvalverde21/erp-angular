import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireBatchIndexComponent } from './acquire-batch-index.component';

describe('AcquireBatchIndexComponent', () => {
  let component: AcquireBatchIndexComponent;
  let fixture: ComponentFixture<AcquireBatchIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireBatchIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireBatchIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
