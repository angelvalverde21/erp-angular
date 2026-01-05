import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionValueCreateComponent } from './option-value-create.component';

describe('OptionValueCreateComponent', () => {
  let component: OptionValueCreateComponent;
  let fixture: ComponentFixture<OptionValueCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionValueCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionValueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
