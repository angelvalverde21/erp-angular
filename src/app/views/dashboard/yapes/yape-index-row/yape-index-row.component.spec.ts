import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapeIndexRowComponent } from './yape-index-row.component';

describe('YapeIndexRowComponent', () => {
  let component: YapeIndexRowComponent;
  let fixture: ComponentFixture<YapeIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapeIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YapeIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
