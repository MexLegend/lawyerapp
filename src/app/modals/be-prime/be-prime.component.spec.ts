import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BePrimeComponent } from './be-prime.component';

describe('BePrimeComponent', () => {
  let component: BePrimeComponent;
  let fixture: ComponentFixture<BePrimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BePrimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BePrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
