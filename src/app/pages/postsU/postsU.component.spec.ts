import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsUComponent } from './postsU.component';

describe('PostsUComponent', () => {
  let component: PostsUComponent;
  let fixture: ComponentFixture<PostsUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
