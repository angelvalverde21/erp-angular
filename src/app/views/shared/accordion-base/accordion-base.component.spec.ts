import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionBaseComponent } from './accordion-base.component';

describe('AccordionBaseComponent', () => {
  let component: AccordionBaseComponent;
  let fixture: ComponentFixture<AccordionBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
