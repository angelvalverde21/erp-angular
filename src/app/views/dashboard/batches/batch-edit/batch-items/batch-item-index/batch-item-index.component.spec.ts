import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchItemIndexComponent } from './batch-item-index.component';

describe('BatchItemIndexComponent', () => {
  let component: BatchItemIndexComponent;
  let fixture: ComponentFixture<BatchItemIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchItemIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchItemIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
