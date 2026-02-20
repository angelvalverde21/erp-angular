import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionsPageComponent } from './receptions-page.component';

describe('ReceptionsPageComponent', () => {
  let component: ReceptionsPageComponent;
  let fixture: ComponentFixture<ReceptionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
