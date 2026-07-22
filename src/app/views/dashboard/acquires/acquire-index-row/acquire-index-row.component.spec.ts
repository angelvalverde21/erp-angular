import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireIndexRowComponent } from './acquire-index-row.component';

describe('AcquireIndexRowComponent', () => {
  let component: AcquireIndexRowComponent;
  let fixture: ComponentFixture<AcquireIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
