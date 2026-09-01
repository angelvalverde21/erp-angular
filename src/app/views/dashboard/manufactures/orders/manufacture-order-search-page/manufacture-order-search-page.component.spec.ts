import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderSearchPageComponent } from './manufacture-order-search-page.component';

describe('ManufactureOrderSearchPageComponent', () => {
  let component: ManufactureOrderSearchPageComponent;
  let fixture: ComponentFixture<ManufactureOrderSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
