import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchEditPageComponent } from './batch-edit-page.component';

describe('BatchEditPageComponent', () => {
  let component: BatchEditPageComponent;
  let fixture: ComponentFixture<BatchEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
