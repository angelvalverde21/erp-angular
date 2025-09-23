import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValueIndexComponent } from './attribute-value-index.component';

describe('AttributeValueIndexComponent', () => {
  let component: AttributeValueIndexComponent;
  let fixture: ComponentFixture<AttributeValueIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeValueIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeValueIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
