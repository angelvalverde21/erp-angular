import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIndexPageComponent } from './customer-index-page.component';

describe('CustomerIndexPageComponent', () => {
  let component: CustomerIndexPageComponent;
  let fixture: ComponentFixture<CustomerIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


