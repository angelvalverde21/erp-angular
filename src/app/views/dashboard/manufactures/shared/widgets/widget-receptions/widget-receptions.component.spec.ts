import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetReceptionsComponent } from './widget-receptions.component';

describe('WidgetReceptionsComponent', () => {
  let component: WidgetReceptionsComponent;
  let fixture: ComponentFixture<WidgetReceptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetReceptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetReceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
