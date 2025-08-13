import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSectionsComponent } from './batch-sections.component';

describe('BatchSectionsComponent', () => {
  let component: BatchSectionsComponent;
  let fixture: ComponentFixture<BatchSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
