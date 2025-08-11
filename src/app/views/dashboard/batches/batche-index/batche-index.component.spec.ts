import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheIndexComponent } from './batche-index.component';

describe('BatcheIndexComponent', () => {
  let component: BatcheIndexComponent;
  let fixture: ComponentFixture<BatcheIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
