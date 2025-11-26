import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTrabajadoresScreenComponent } from './lista-trabajadores-screen.component';

describe('ListaTrabajadoresScreenComponent', () => {
  let component: ListaTrabajadoresScreenComponent;
  let fixture: ComponentFixture<ListaTrabajadoresScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTrabajadoresScreenComponent]
    });
    fixture = TestBed.createComponent(ListaTrabajadoresScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
