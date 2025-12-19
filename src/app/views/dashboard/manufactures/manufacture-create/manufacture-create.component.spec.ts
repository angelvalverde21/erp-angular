import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureCreateComponent } from './manufacture-create.component';

describe('ManufactureCreateComponent', () => {
  let component: ManufactureCreateComponent;
  let fixture: ComponentFixture<ManufactureCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
