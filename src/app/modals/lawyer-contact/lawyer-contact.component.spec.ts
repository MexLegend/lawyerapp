import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerContactComponent } from './lawyer-contact.component';

describe('LawyerContactComponent', () => {
  let component: LawyerContactComponent;
  let fixture: ComponentFixture<LawyerContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
