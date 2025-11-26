import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTrabajadoresComponent } from './registro-trabajadores.component';

describe('RegistroTrabajadoresComponent', () => {
  let component: RegistroTrabajadoresComponent;
  let fixture: ComponentFixture<RegistroTrabajadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroTrabajadoresComponent]
    });
    fixture = TestBed.createComponent(RegistroTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
