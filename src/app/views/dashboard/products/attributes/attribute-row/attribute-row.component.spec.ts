import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeRowComponent } from './attribute-row.component';

describe('AttributeRowComponent', () => {
  let component: AttributeRowComponent;
  let fixture: ComponentFixture<AttributeRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
