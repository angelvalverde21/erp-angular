import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureEditComponent } from './manufacture-edit.component';

describe('ManufactureEditComponent', () => {
  let component: ManufactureEditComponent;
  let fixture: ComponentFixture<ManufactureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
