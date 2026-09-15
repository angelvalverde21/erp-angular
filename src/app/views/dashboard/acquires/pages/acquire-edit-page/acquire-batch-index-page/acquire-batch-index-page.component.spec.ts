import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireBatchIndexPageComponent } from './acquire-batch-index-page.component';

describe('AcquireBatchIndexPageComponent', () => {
  let component: AcquireBatchIndexPageComponent;
  let fixture: ComponentFixture<AcquireBatchIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireBatchIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireBatchIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
