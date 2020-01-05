import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteDetalleComponent } from './expediente-detalle.component';

describe('ExpedienteDetalleComponent', () => {
  let component: ExpedienteDetalleComponent;
  let fixture: ComponentFixture<ExpedienteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpedienteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedienteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
