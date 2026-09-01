import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchIndexPageComponent } from './batch-index-page.component';

describe('BatchIndexPageComponent', () => {
  let component: BatchIndexPageComponent;
  let fixture: ComponentFixture<BatchIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
