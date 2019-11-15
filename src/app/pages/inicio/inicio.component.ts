import { Component, OnInit } from '@angular/core';
declare var $: any, M: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // start carousel Partners
    $('#carouselPartner').carousel({
      fullWidth: false,
      numVisible: 7
    });

    // Autoplay carousel Partners
    let startTime = 3;
    let currentTime = 0;
    let myTimer;
    let myTimerSpeed = 1000; // 1 sec

    resetTimer();
    // startTimer();

    // $('#carouselPartner').hover(function (e) {
    //   e.stopPropagation();
    //   resetTimer();
    // }, function () {
    //   startTimer();
    // });

    function resetTimer() {
      stopTimer();
      currentTime = startTime;
    }

    function startTimer() {
      resetTimer();
      myTimer = setInterval(timerTick, myTimerSpeed);
    }

    function stopTimer() {
      window.clearInterval(myTimer);
    }

    function timerTick() {
      currentTime--;
      if (currentTime == 0) {
        $('#carouselPartner').carousel('next');
        resetTimer();
        startTimer();
      }
    }

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
  }

}
