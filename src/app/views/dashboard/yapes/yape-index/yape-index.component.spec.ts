import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapeIndexComponent } from './yape-index.component';

describe('YapeIndexComponent', () => {
  let component: YapeIndexComponent;
  let fixture: ComponentFixture<YapeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapeIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YapeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
