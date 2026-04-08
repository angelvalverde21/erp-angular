import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCreatePageComponent } from './batch-create-page.component';

describe('BatchCreatePageComponent', () => {
  let component: BatchCreatePageComponent;
  let fixture: ComponentFixture<BatchCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
