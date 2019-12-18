import { Component, OnInit, ViewChild } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor() {
    
  }

  ngOnInit() {
    $(document).ready(function () {

      // start carousel Partners
      $('#carouselPartner').carousel({
        fullWidth: false,
        numVisible: 7
      });

      // Autoplay carousel Partners
      let autoplayCarouselPartners = true;
      run();

      function run() {
        // console.log(autoplayCarouselPartners);
        // setTimeout(function () {
        if (autoplayCarouselPartners) { 
          $('#carouselPartner').carousel('next'); 
        }
        // }, carousel_interval);
        setTimeout(run, 3000);
      }
      $('#carouselPartner').hover(function () {
        autoplayCarouselPartners = false;
      }, function () { autoplayCarouselPartners = true; });

      // function run() {
      //   int = setInterval(function () {
      //     $('#carouselPartner').carousel('next');
      //   }, carousel_interval);
      // }
      // function stop() {
      //   clearInterval(int);
      // }
      // $('#carouselPartner').hover(stop, run);

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

      // Change Z-idex of Navbar When Carousel Partner Image Clicked
      var observer = new MutationObserver(function (mutations) {
        console.log();
        mutations.forEach(function (mutation) {
          if (mutation.attributeName === "class") {
            if ($(mutation.target).hasClass("active")) {
              $(".navbar-fixed").css({ "z-index": "0", "opacity": "0", "transition": "all 0.2s ease-in-out" });
              $(".material-placeholder").css("overflow", "visible");
            } else {
              $(".navbar-fixed").css({ "z-index": "997", "opacity": "1", "transition": "all 0.2s ease-in-out" });
              $(".material-placeholder").css("overflow", "hidden");
            }
            // var attributeValue = $(mutation.target).prop(mutation.attributeName);
          }
        });
      });

      $(".materialboxed").each((index, value) => {
        observer.observe(value, {
          attributes: true
        });
      });
    });

  }

}