import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterScreenComponent } from './master-screen.component';

describe('MasterScreenComponent', () => {
  let component: MasterScreenComponent;
  let fixture: ComponentFixture<MasterScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterScreenComponent]
    });
    fixture = TestBed.createComponent(MasterScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
