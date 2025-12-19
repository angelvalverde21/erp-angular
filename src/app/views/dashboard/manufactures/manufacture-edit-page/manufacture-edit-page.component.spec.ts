import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureEditPageComponent } from './manufacture-edit-page.component';

describe('ManufactureEditPageComponent', () => {
  let component: ManufactureEditPageComponent;
  let fixture: ComponentFixture<ManufactureEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
