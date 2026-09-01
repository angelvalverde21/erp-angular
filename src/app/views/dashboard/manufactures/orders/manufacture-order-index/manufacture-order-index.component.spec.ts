import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderIndexComponent } from './manufacture-order-index.component';

describe('ManufactureOrderIndexComponent', () => {
  let component: ManufactureOrderIndexComponent;
  let fixture: ComponentFixture<ManufactureOrderIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
