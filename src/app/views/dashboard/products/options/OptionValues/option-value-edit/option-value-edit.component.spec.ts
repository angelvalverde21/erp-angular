import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionValueEditComponent } from './option-value-edit.component';

describe('OptionValueEditComponent', () => {
  let component: OptionValueEditComponent;
  let fixture: ComponentFixture<OptionValueEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionValueEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionValueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
