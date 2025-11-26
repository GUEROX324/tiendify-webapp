import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAdminScreenComponent } from './lista-admin-screen.component';

describe('ListaAdminScreenComponent', () => {
  let component: ListaAdminScreenComponent;
  let fixture: ComponentFixture<ListaAdminScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaAdminScreenComponent]
    });
    fixture = TestBed.createComponent(ListaAdminScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
