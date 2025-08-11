import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchIndexRowComponent } from './batch-index-row.component';

describe('BatchIndexRowComponent', () => {
  let component: BatchIndexRowComponent;
  let fixture: ComponentFixture<BatchIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
