import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/Post';

declare var $: any;

@Component({
  selector: 'app-postsU',
  templateUrl: './postsU.component.html',
  styleUrls: ['./postsU.component.css']
})
export class PostsUComponent implements OnInit {

  allowedChars = '@ # $ % ^ & * ( ) _ - ., ? < > { } [ ] ! +';
  currentPage: number = 1;
  filterValue: string;
  posts: Post[] = [];
  text = '<b><i>Ejemplo-2</i></b>';

  constructor(
    private router: Router,
    private _postsS: PostsService
  ) { }

  ngOnInit() {
    this._postsS.getPosts()
      .subscribe(resp => {
        this.posts = resp.docs;
      })
  }

  filter(value: string) {
    if(value.length >= 1 && value !== '')
      this.filterValue = value;
    else
      this.filterValue = '';
  }

  // Go to News Comments Section
  goToComments(id): void {
    this.router.navigate([`/articulo-detalle/${id}`]);
    $(document).ready(function () {
      // scroll to your element
      document.getElementById("comments-box").scrollIntoView(true);

      // now account for fixed header
      var scrolledY = window.scrollY;

      if (scrolledY) {
        window.scroll(0, scrolledY - 100);
      }
    });
  }

  // Scroll to Top of New Page 
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}