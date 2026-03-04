import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierSearchComponent } from './courier-search.component';

describe('CourierSearchComponent', () => {
  let component: CourierSearchComponent;
  let fixture: ComponentFixture<CourierSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
