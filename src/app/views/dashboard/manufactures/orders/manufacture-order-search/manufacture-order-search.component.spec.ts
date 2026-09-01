import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderSearchComponent } from './manufacture-order-search.component';

describe('ManufactureOrderSearchComponent', () => {
  let component: ManufactureOrderSearchComponent;
  let fixture: ComponentFixture<ManufactureOrderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
