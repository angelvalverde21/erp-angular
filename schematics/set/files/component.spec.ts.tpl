import { ComponentFixture, TestBed } from '@angular/core/testing';
import { __NAME__Component } from './__NAME__.component';

describe('__NAME__Component', () => {
  let component: __NAME__Component;
  let fixture: ComponentFixture<__NAME__Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [__NAME__Component]
    }).compileComponents();

    fixture = TestBed.createComponent(__NAME__Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});