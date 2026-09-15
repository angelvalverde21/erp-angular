import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOptionsComponent } from './view-options.component';

describe('ViewOptionsComponent', () => {
  let component: ViewOptionsComponent;
  let fixture: ComponentFixture<ViewOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
