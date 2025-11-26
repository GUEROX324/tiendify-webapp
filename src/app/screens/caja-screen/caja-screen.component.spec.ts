import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaScreenComponent } from './caja-screen.component';

describe('CajaScreenComponent', () => {
  let component: CajaScreenComponent;
  let fixture: ComponentFixture<CajaScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CajaScreenComponent]
    });
    fixture = TestBed.createComponent(CajaScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
