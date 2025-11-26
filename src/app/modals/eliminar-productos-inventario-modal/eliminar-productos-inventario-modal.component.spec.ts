import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarProductosInventarioModalComponent } from './eliminar-productos-inventario-modal.component';

describe('EliminarProductosInventarioModalComponent', () => {
  let component: EliminarProductosInventarioModalComponent;
  let fixture: ComponentFixture<EliminarProductosInventarioModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarProductosInventarioModalComponent]
    });
    fixture = TestBed.createComponent(EliminarProductosInventarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
