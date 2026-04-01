import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderIndexRowComponent } from './manufacture-order-index-row.component';

describe('ManufactureOrderIndexRowComponent', () => {
  let component: ManufactureOrderIndexRowComponent;
  let fixture: ComponentFixture<ManufactureOrderIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
