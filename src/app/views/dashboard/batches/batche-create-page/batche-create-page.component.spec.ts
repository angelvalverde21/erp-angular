import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheCreatePageComponent } from './batche-create-page.component';

describe('BatcheCreatePageComponent', () => {
  let component: BatcheCreatePageComponent;
  let fixture: ComponentFixture<BatcheCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
