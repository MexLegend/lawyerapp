import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesFormComponent } from './notificaciones-form.component';

describe('NotificacionesFormComponent', () => {
  let component: NotificacionesFormComponent;
  let fixture: ComponentFixture<NotificacionesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
