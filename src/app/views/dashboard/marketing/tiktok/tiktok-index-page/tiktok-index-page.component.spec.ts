import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokIndexPageComponent } from './tiktok-index-page.component';

describe('TiktokIndexPageComponent', () => {
  let component: TiktokIndexPageComponent;
  let fixture: ComponentFixture<TiktokIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiktokIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiktokIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
