import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchIndexComponent } from './batch-index.component';

describe('BatchIndexComponent', () => {
  let component: BatchIndexComponent;
  let fixture: ComponentFixture<BatchIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
