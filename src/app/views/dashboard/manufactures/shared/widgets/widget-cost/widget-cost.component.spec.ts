import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCostComponent } from './widget-cost.component';

describe('WidgetCostComponent', () => {
  let component: WidgetCostComponent;
  let fixture: ComponentFixture<WidgetCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetCostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
