import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidIndexComponent } from './void-index.component';

describe('VoidIndexComponent', () => {
  let component: VoidIndexComponent;
  let fixture: ComponentFixture<VoidIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoidIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
