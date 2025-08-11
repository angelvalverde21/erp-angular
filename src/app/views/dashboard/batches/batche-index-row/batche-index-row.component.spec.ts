import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheIndexRowComponent } from './batche-index-row.component';

describe('BatcheIndexRowComponent', () => {
  let component: BatcheIndexRowComponent;
  let fixture: ComponentFixture<BatcheIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
