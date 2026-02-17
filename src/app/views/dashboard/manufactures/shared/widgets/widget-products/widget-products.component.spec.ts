import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetProductsComponent } from './widget-products.component';

describe('WidgetProductsComponent', () => {
  let component: WidgetProductsComponent;
  let fixture: ComponentFixture<WidgetProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
