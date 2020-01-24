import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarExpedienteComponent } from './seleccionar-expediente.component';

describe('SeleccionarExpedienteComponent', () => {
  let component: SeleccionarExpedienteComponent;
  let fixture: ComponentFixture<SeleccionarExpedienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarExpedienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
