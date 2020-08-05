import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNotesComponent } from './select-notes.component';

describe('SelectNotesComponent', () => {
  let component: SelectNotesComponent;
  let fixture: ComponentFixture<SelectNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
