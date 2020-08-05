import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosDetalleComponent } from './casos-detalle.component';

describe('CasosDetalleComponent', () => {
  let component: CasosDetalleComponent;
  let fixture: ComponentFixture<CasosDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasosDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
