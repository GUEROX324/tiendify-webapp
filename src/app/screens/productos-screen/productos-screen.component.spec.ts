import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosScreenComponent } from './productos-screen.component';

describe('ProductosScreenComponent', () => {
  let component: ProductosScreenComponent;
  let fixture: ComponentFixture<ProductosScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosScreenComponent]
    });
    fixture = TestBed.createComponent(ProductosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
