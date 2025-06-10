import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResaleProductComponent } from './resale-product.component';

describe('ResaleProductComponent', () => {
  let component: ResaleProductComponent;
  let fixture: ComponentFixture<ResaleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResaleProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResaleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
