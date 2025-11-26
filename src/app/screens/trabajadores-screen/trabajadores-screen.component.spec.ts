import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadoresScreenComponent } from './trabajadores-screen.component';

describe('TrabajadoresScreenComponent', () => {
  let component: TrabajadoresScreenComponent;
  let fixture: ComponentFixture<TrabajadoresScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabajadoresScreenComponent]
    });
    fixture = TestBed.createComponent(TrabajadoresScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
