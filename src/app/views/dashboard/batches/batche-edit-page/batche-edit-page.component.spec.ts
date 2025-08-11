import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheEditPageComponent } from './batche-edit-page.component';

describe('BatcheEditPageComponent', () => {
  let component: BatcheEditPageComponent;
  let fixture: ComponentFixture<BatcheEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
