import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeIndexRowComponent } from './attribute-index-row.component';

describe('AttributeIndexRowComponent', () => {
  let component: AttributeIndexRowComponent;
  let fixture: ComponentFixture<AttributeIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
