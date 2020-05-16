import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    $(document).ready(function () {

      // start carousel Partners
      $('#carousel-Partners').carousel({
        fullWidth: false,
        padding: 100,
        dist: 0,
        numVisible: 5,
        indicators: true
      });

      const carouselInterval = 4000;
      let int: any; 

      function run() {
        int = setInterval(function () {
          $('#carousel-Partners').carousel('next');
        }, carouselInterval);
      }
      function stop() {
        clearInterval(int);
      }
      $('#carousel-Partners').hover(stop, run);

      // start carousel Principal
      $('#carouselPrincipal.carousel-slider').carousel({
        dist: 0,
        padding: 0,
        fullWidth: true,
        indicators: false,
        duration: 100
      });

      // move next carousel
      $('.moveNextCarousel').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#carouselPrincipal').carousel('next');
        resetAnimation();
      });

      // move prev carousel
      $('.movePrevCarousel').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#carouselPrincipal').carousel('prev');
        resetAnimation();
      });

      // automatically change carousel slides 
      // setTimeout(autoplay, 8000);

      function autoplay() {
        $("#carouselPrincipal").carousel("next");
        resetAnimation();
        setTimeout(autoplay, 8000);
      }

      /* Kick off the initial slide animation when the document is ready */
      var hrWidth = 100;

      $(".carousel-progress-bar-timer").css("width", hrWidth + "%");

      function resetAnimation() {
        hrWidth = 0;
        $(".carousel-progress-bar-timer").css("width", hrWidth + "%");
        $("hr").removeClass("animate").addClass("stopanimation");
        setTimeout(startAnimation, 10);
      }

      function startAnimation() {
        hrWidth = 100;
        $("hr")
          .removeClass("stopanimation")
          .addClass("animate");
        $(".carousel-progress-bar-timer").css("width", 100 + "%");
      }

      // Start Material Box
      $('.materialboxed').materialbox();
    });
  }
}