import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderEditComponent } from './manufacture-order-edit.component';

describe('ManufactureOrderEditComponent', () => {
  let component: ManufactureOrderEditComponent;
  let fixture: ComponentFixture<ManufactureOrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
