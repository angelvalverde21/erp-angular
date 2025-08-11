import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatcheIndexPageComponent } from './batche-index-page.component';

describe('BatcheIndexPageComponent', () => {
  let component: BatcheIndexPageComponent;
  let fixture: ComponentFixture<BatcheIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatcheIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatcheIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
