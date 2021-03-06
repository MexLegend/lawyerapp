import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: "app-postsU",
  templateUrl: "./postsU.component.html",
  styleUrls: ["./postsU.component.css"],
})
export class PostsUComponent implements OnInit {
  constructor(private router: Router, private _postsS: PostsService) {}

  subscriptionsArray: Subscription[] = [];

  allowedChars = "@ # $ % ^ & * ( ) _ - ., ? < > { } [ ] ! +";
  currentPage: number = 1;
  filterValue: string;
  posts: Post[] = [];
  selectedEntry: number = 10;

  ngOnInit() {
    this.subscriptionsArray.push(
      this._postsS.getPosts(true).subscribe((resp) => {
        this.posts = resp.docs;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Go to News Comments Section
  goToComments(id): void {
    this.router.navigate([`/articulo-detalle/${id}`]);
    $(document).ready(function () {
      // scroll to your element
      document
        .getElementById("comments-box")
        .scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

      // now account for fixed header
      // var scrolledY = window.scrollY;

      // if (scrolledY) {
      //   window.scroll(0, scrolledY - 71);
      // }
    });
  }

  // Scroll to Top of New Page
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
