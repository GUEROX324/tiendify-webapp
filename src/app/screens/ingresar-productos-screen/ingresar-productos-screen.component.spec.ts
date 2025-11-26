import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarProductosScreenComponent } from './ingresar-productos-screen.component';

describe('IngresarProductosScreenComponent', () => {
  let component: IngresarProductosScreenComponent;
  let fixture: ComponentFixture<IngresarProductosScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresarProductosScreenComponent]
    });
    fixture = TestBed.createComponent(IngresarProductosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
