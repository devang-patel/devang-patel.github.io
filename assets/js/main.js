(function ($) {

  if (typeof(Storage) !== "undefined") {
      // Code for localStorage
      if(window.localStorage.getItem('mode') === 'dark-mode') {
        $('.modes .day').removeClass('active');
        $('body').removeClass('light-mode');
        $('.modes .night').addClass('active');
        $('body').addClass('dark-mode');
      }
    } else {
      // No web storage Support.
  }
    
  var $window = $(window),
    $document = $(document),
    header = $("header"),
    heroHeadingElm = $(".hero h1 span span"),
    pageContent = $(".page-content");
  aboutContent = $(".about-content");
  var headerOnce = true;
  CSSPlugin.defaultForce3D = true;

  function setupAnimation() {
    TweenMax.to(heroHeadingElm, 0.1, {
      y: 90
    });
    TweenMax.to(pageContent, 0.1, {
      autoAlpha: 0,
      y: 140
    });
  }
  setupAnimation();

  function initAnimation() {
    if (headerOnce) {
      TweenMax.staggerTo(heroHeadingElm, 1, {
        y: 0,
        delay: 0.2,
        ease: Back.easeOut.config(1.4)
      }, 0.14);
      TweenMax.to(pageContent, 0.6, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        ease: Back.easeOut.config(2)
      });

      headerOnce = false;
    }
  }


  function hideLoader(callback) {
    TweenMax.to('.content', 0.4, {
      autoAlpha: 1,
      onComplete: function () {
        if (callback) {
          callback();
        }
      }
    });
  }

  function showLoader(callback) {
    header.removeClass('light-header');
    TweenMax.to('.content', 0.4, {
      autoAlpha: 0,
      onComplete: function () {
        if (callback) {
          callback();
        }
      }
    });
  }

  function showMobileMenu() {
    $(".mobile-menu").addClass("menu-open");
    $('.mobile-menu-btn').addClass("open");
    TweenMax.to($(".mobile-menu"), 0.3, {
      autoAlpha: 1
    })
    TweenMax.staggerTo($(".mobile-menu li"), 0.5, {
      y: 0,
      autoAlpha: 1,
      delay: 0.3
    }, 0.15);
  }

  function hideMobileMenu() {
    $(".mobile-menu").removeClass("menu-open");
    $('.mobile-menu-btn').removeClass("open");
    TweenMax.to($(".mobile-menu"), 0.5, {
      autoAlpha: 0,
      delay: 0.8
    })
    TweenMax.staggerTo($(".mobile-menu li"), 0.4, {
      y: 20,
      autoAlpha: 0
    }, -0.15);
  }

  $(window).on("scroll", function () {
    var height = $(window).scrollTop();
    if (height > 100) {
      $("header").addClass("sticky")
    } else {
      $("header").removeClass("sticky")
    }
  });

  $(document).on("click", "a.scroll-animate", function (event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: $($.attr(this, "href")).offset().top
    }, 500)
  });

  $(document).on("click", "nav li", function (event) {
    event.preventDefault();
    $('nav li').removeClass('active');
    $(this).addClass('active');
  });

  $(document).on("click", ".modes .night", function (event) {
    event.preventDefault();
    $('.modes .day').removeClass('active');
    $('body').removeClass('light-mode');
    $(this).addClass('active');
    $('body').addClass('dark-mode');
    window.localStorage.setItem('mode', 'dark-mode');
  });

  $(document).on("click", ".modes .day", function (event) {
    event.preventDefault();
    $('.modes .night').removeClass('active');
    $('body').removeClass('dark-mode');
    $(this).addClass('active');
    $('body').addClass('light-mode');
    window.localStorage.setItem('mode', 'light-mode');
  });

  $(document).on("click", ".logo", function (event) {
    event.preventDefault();
    $('nav li').removeClass('active');
    $('nav li:first-child').addClass('active');
  });

  $(document).on("click", ".mobile-menu-btn", function (event) {
    event.preventDefault();
    $(".mobile-menu").toggleClass("menu-open");
    $(this).toggleClass("open");
    if ($(this).hasClass("open")) {
      showMobileMenu();
    } else {
      hideMobileMenu();
    }
  });

  function draw() {
    requestAnimationFrame(draw);
    scrollEvent()
  }
  draw();


  window.onload = function () {
    //  if (!is_touch_device()) {
    TweenMax.to($(".preloader"), 0.5, {
      autoAlpha: 0,
      delay: 0.4,
      onComplete: function () {
        initAnimation()
        $(".preloader").css('z-index', 9);
      }
    })
    //}
  };

  jQuery(document).ready(function () {

    var siteUrl = 'http://' + (document.location.hostname || document.location.host);
    $(document).delegate('a[href^="/"],a[href^="' + siteUrl + '"]', "click", function (e) {
      e.preventDefault();
      History.pushState({}, "", this.pathname);
    });

    History.Adapter.bind(window, 'statechange', function () {
      $("html, body").animate({
        scrollTop: $("html, body").offset().top
      }, 0)
      hideMobileMenu();
      showLoader(() => {
        var State = History.getState();
        $.get(State.url, function (data) { // Use AJAX to get the new content.
          document.title = data.match(/<title>(.*?)<\/title>/)[1];
          var content = $($.parseHTML(data)).filter(".content").html();
          $('.content').html(content);

          hideLoader(() => {
            if ($($.parseHTML(data)).filter("header").hasClass('light-header')) {
              header.addClass('light-header');
            } else {
              header.removeClass('light-header');
            }
            initAnimation();
            var bLazy = new Blazy({
              success: function (element) {
                setTimeout(function () {
                  // We want to remove the loader gif now.
                  // First we find the parent container
                  // then we remove the "loading" class which holds the loader image
                  var parent = element.parentNode;
                  parent.className = parent.className.replace(/\bloading\b/, "");
                }, 200);
              }
            });
            console.log('reinit...');
            //}
          });
        });
      })

    });

  });


})(jQuery);



function scrollEvent() {
  if (!is_touch_device()) {
    viewportTop = $(window).scrollTop();
    windowHeight = $(window).height();
    viewportBottom = windowHeight + viewportTop;
    if ($(window).width()) $("[data-parallax='true']").each(function () {
      distance = viewportTop * $(this).attr("data-speed");
      if ($(this).attr("data-direction") === "up") {
        sym = "-"
      } else {
        sym = ""
      }
      $(this).css({
        "transform": "translate3d(0, " + sym + distance + "px,0)",
        "-webkit-transform": "translate3d(0, " + sym + distance + "px,0)",
        "-moz-transform": "translate3d(0, " + sym + distance + "px,0)"
      })
    })
  }
}

function is_touch_device() {
  return "ontouchstart" in window || "onmsgesturechange" in window
}
