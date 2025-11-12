import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMasterComponent } from './registro-master.component';

describe('RegistroMasterComponent', () => {
  let component: RegistroMasterComponent;
  let fixture: ComponentFixture<RegistroMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroMasterComponent]
    });
    fixture = TestBed.createComponent(RegistroMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
