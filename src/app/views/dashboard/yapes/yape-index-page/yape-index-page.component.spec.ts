import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapeIndexPageComponent } from './yape-index-page.component';

describe('YapeIndexPageComponent', () => {
  let component: YapeIndexPageComponent;
  let fixture: ComponentFixture<YapeIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapeIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YapeIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
