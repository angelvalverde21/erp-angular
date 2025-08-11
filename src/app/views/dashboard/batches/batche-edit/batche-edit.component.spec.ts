import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheEditComponent } from './batche-edit.component';

describe('BatcheEditComponent', () => {
  let component: BatcheEditComponent;
  let fixture: ComponentFixture<BatcheEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
