import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPurchasesComponent } from './widget-purchases.component';

describe('WidgetPurchasesComponent', () => {
  let component: WidgetPurchasesComponent;
  let fixture: ComponentFixture<WidgetPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetPurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
