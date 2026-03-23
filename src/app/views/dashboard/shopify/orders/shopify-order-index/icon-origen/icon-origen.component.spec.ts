import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconOrigenComponent } from './icon-origen.component';

describe('IconOrigenComponent', () => {
  let component: IconOrigenComponent;
  let fixture: ComponentFixture<IconOrigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconOrigenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
