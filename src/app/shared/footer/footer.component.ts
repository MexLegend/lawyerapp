import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}