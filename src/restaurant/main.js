/* Navbar scroll */
$(function () {
  var nav = $(".navbar"),
    doc = $(document),
    win = $(window);

  win.scroll(function () {
    if (doc.scrollTop() > 80) {
      nav.addClass("scrolled");
    } else {
      nav.removeClass("scrolled");
    }
  });

  win.scroll();
});

/* ***** Btn More-Less ***** */
$("#more").click(function () {
  var $this = $(this);
  $this.toggleClass("more");
  if ($this.hasClass("more")) {
    $this.text("More");
  } else {
    $this.text("Less");
  }
});

/* ***** Slideanim  ***** */
$(window).scroll(function () {
  $(".slideanim").each(function () {
    var pos = $(this).offset().top;

    var winTop = $(window).scrollTop();
    if (pos < winTop + 600) {
      $(this).addClass("slide");
    }
  });
});

/* ***** Smooth Scrolling  ***** */
$(document).ready(function () {
  $(".navbar a, #service a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;

      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        900,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });

  /* ***** Scroll to Top ***** */
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 300) {
      $(".to-top").fadeIn(200);
    } else {
      $(".to-top").fadeOut(200);
    }
  });
  $(".to-top").click(function () {
    $(".body,html").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });
});
