import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderFormComponent } from './manufacture-order-form.component';

describe('ManufactureOrderFormComponent', () => {
  let component: ManufactureOrderFormComponent;
  let fixture: ComponentFixture<ManufactureOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
