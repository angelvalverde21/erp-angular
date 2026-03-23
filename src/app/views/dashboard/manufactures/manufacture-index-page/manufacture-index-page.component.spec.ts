import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureIndexPageComponent } from './manufacture-index-page.component';

describe('ManufactureIndexPageComponent', () => {
  let component: ManufactureIndexPageComponent;
  let fixture: ComponentFixture<ManufactureIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
