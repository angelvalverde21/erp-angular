import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureCreatePageComponent } from './manufacture-create-page.component';

describe('ManufactureCreatePageComponent', () => {
  let component: ManufactureCreatePageComponent;
  let fixture: ComponentFixture<ManufactureCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
