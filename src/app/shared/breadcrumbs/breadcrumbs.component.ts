import { Component, OnInit } from "@angular/core";
import { Meta, MetaDefinition, Title } from "@angular/platform-browser";
import { ActivationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.css"],
})
export class BreadcrumbsComponent implements OnInit {
  constructor(public meta: Meta, public router: Router, public title: Title) {
    this.subscriptionsArray.push(
      this.getDataRoute().subscribe((data) => {
        this.label = data.titulo;
        this.title.setTitle(this.label);
        const metaTag: MetaDefinition = {
          name: "description",
          content: this.label,
        };
        this.meta.updateTag(metaTag);
      })
    );
  }

  subscriptionsArray: Subscription[] = [];

  label: "";

  ngOnInit() {}

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  getDataRoute() {
    return this.router.events
      .pipe(filter((event) => event instanceof ActivationEnd))
      .pipe(
        filter((event: ActivationEnd) => event.snapshot.firstChild === null)
      )
      .pipe(map((event: ActivationEnd) => event.snapshot.data));
  }
}
