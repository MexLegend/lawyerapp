import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEvidenceComponent } from './select-evidence.component';

describe('SelectEvidenceComponent', () => {
  let component: SelectEvidenceComponent;
  let fixture: ComponentFixture<SelectEvidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEvidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
