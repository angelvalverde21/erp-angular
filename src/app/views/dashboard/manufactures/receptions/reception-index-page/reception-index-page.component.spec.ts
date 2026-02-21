import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionIndexPageComponent } from './reception-index-page.component';

describe('ReceptionIndexPageComponent', () => {
  let component: ReceptionIndexPageComponent;
  let fixture: ComponentFixture<ReceptionIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
