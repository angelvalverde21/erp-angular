import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureIndexComponent } from './manufacture-index.component';

describe('ManufactureIndexComponent', () => {
  let component: ManufactureIndexComponent;
  let fixture: ComponentFixture<ManufactureIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
