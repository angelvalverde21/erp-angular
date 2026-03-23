import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionValueIndexComponent } from './option-value-index.component';

describe('OptionValueIndexComponent', () => {
  let component: OptionValueIndexComponent;
  let fixture: ComponentFixture<OptionValueIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionValueIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionValueIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
