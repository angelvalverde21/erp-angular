import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokIndexComponent } from './tiktok-index.component';

describe('TiktokIndexComponent', () => {
  let component: TiktokIndexComponent;
  let fixture: ComponentFixture<TiktokIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiktokIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiktokIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
