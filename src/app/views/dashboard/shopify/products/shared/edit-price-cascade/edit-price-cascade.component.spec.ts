import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceCascadeComponent } from './edit-price-cascade.component';

describe('EditPriceCascadeComponent', () => {
  let component: EditPriceCascadeComponent;
  let fixture: ComponentFixture<EditPriceCascadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPriceCascadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPriceCascadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
