import { Location } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../services/users.service';

declare var $: any;

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    public _usersS: UsersService,
    public _postsS: PostsService
  ) {
    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];

      if ( id !== 'new' ) {
        this.loadPost( id )
      }
    })
  }
  
  login = 'login';
  post: Post;

  ngOnInit() {
    $(document).ready(function () {
      // Hide Comment Buttons When Cancel Button is Clicked
      $(document).on("click", ".cancel-comment", function () {
        $("#comment").val('');
        $(".comment-label").removeClass("active");
        $('.send-comment').prop('disabled', true);
        $(".comment-buttons").removeClass("comment-buttons-show");
        $(".comment-buttons").addClass("comment-buttons-hide");
      });
      // Enable Comment Button When Text Input is Not Empty
      $(document).on("keyup", "#comment", function () {
        if ($(this).val() !== '') {
          $('.send-comment').prop('disabled', false);
        } else {
          $('.send-comment').prop('disabled', true);
        }
      })
    });
  }

  // Return to Previous Page
  goBack(): void {
    this.location.back();
  }

  loadPost(id) {
    this._postsS.getPost( id )
        .subscribe( post => {
          console.log(post)
          this.post = post;
        })
  }

  // Show Comment Buttons When Comment Input Text is Focused
  showCommentButtons() {
    if ($(".comment-buttons").hasClass("comment-buttons-hide")) {
      $(".comment-buttons").removeClass("comment-buttons-hide");
    }
    $(".comment-buttons").addClass("comment-buttons-show");
  }

  // Trigger Login Modal When Is Not Logged In
  showM() {
    $('#modalRegistro').modal('open');
  }
}