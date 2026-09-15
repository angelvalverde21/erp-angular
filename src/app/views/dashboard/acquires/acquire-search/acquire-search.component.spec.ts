import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireSearchComponent } from './acquire-search.component';

describe('AcquireSearchComponent', () => {
  let component: AcquireSearchComponent;
  let fixture: ComponentFixture<AcquireSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
