import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureFormComponent } from './manufacture-form.component';

describe('ManufactureFormComponent', () => {
  let component: ManufactureFormComponent;
  let fixture: ComponentFixture<ManufactureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
