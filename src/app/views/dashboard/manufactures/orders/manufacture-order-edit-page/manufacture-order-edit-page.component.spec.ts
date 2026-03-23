import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderEditPageComponent } from './manufacture-order-edit-page.component';

describe('ManufactureOrderEditPageComponent', () => {
  let component: ManufactureOrderEditPageComponent;
  let fixture: ComponentFixture<ManufactureOrderEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
