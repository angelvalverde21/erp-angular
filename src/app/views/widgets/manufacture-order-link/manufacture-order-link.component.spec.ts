import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderLinkComponent } from './manufacture-order-link.component';

describe('ManufactureOrderLinkComponent', () => {
  let component: ManufactureOrderLinkComponent;
  let fixture: ComponentFixture<ManufactureOrderLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
