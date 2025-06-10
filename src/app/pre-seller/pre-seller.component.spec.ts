import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSellerComponent } from './pre-seller.component';

describe('PreSellerComponent', () => {
  let component: PreSellerComponent;
  let fixture: ComponentFixture<PreSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
