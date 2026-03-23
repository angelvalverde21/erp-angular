import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderCreatePageComponent } from './manufacture-order-create-page.component';

describe('ManufactureOrderCreatePageComponent', () => {
  let component: ManufactureOrderCreatePageComponent;
  let fixture: ComponentFixture<ManufactureOrderCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
