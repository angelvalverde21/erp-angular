import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderCreateComponent } from './manufacture-order-create.component';

describe('ManufactureOrderCreateComponent', () => {
  let component: ManufactureOrderCreateComponent;
  let fixture: ComponentFixture<ManufactureOrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
