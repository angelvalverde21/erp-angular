import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchItemRowComponent } from './batch-item-row.component';

describe('BatchItemRowComponent', () => {
  let component: BatchItemRowComponent;
  let fixture: ComponentFixture<BatchItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchItemRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
