import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireSearchPageComponent } from './acquire-search-page.component';

describe('AcquireSearchPageComponent', () => {
  let component: AcquireSearchPageComponent;
  let fixture: ComponentFixture<AcquireSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
