import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosFilterComponent } from './usuarios-filter.component';

describe('UsuariosFilterComponent', () => {
  let component: UsuariosFilterComponent;
  let fixture: ComponentFixture<UsuariosFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
