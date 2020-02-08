import { Component, OnInit } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  label: '';

  constructor(public router: Router, public title: Title, public meta: Meta) {
    this.getDataRoute()
      .subscribe(data => {
        this.label = data.titulo;
        this.title.setTitle(this.label);
        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.label
        };
        this.meta.updateTag(metaTag);
      });
  }

  ngOnInit() {
  }

  getDataRoute() {
    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd))
      .pipe(filter((evento: ActivationEnd) => evento.snapshot.firstChild === null))
      .pipe(map((evento: ActivationEnd) => evento.snapshot.data));
  }
  

}
