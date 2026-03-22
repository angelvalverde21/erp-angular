import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderIndexPageComponent } from './manufacture-order-index-page.component';

describe('ManufactureOrderIndexPageComponent', () => {
  let component: ManufactureOrderIndexPageComponent;
  let fixture: ComponentFixture<ManufactureOrderIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
