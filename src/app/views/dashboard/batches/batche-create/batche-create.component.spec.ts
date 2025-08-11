import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheCreateComponent } from './batche-create.component';

describe('BatcheCreateComponent', () => {
  let component: BatcheCreateComponent;
  let fixture: ComponentFixture<BatcheCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
