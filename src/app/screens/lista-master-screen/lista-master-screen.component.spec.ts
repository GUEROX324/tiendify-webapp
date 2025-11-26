import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMasterScreenComponent } from './lista-master-screen.component';

describe('ListaMasterScreenComponent', () => {
  let component: ListaMasterScreenComponent;
  let fixture: ComponentFixture<ListaMasterScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaMasterScreenComponent]
    });
    fixture = TestBed.createComponent(ListaMasterScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
