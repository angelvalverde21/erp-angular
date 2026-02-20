import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureIndexRowComponent } from './manufacture-index-row.component';

describe('ManufactureIndexRowComponent', () => {
  let component: ManufactureIndexRowComponent;
  let fixture: ComponentFixture<ManufactureIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
