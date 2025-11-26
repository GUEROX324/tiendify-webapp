import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarProductoModalComponent } from './eliminar-producto-modal.component';

describe('EliminarProductoModalComponent', () => {
  let component: EliminarProductoModalComponent;
  let fixture: ComponentFixture<EliminarProductoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarProductoModalComponent]
    });
    fixture = TestBed.createComponent(EliminarProductoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
