$(document).ready( function (){
    $(".popup-img").magnificPopup({ type: "image", closeOnContentClick: !0, mainClass: "mfp-img-mobile", image: { verticalFit: !0 } }),
        $("#user-status-carousel").owlCarousel({ items: 4, loop: !1, margin: 16, nav: !1, dots: !1 }),
        $("#chatinputmorelink-carousel").owlCarousel({ items: 2, loop: !1, margin: 16, nav: !1, dots: !1, responsive: { 0: { items: 2 }, 600: { items: 5, nav: !1 }, 992: { items: 8 } } }),
        $("#user-profile-hide").click(function () {
            $(".user-profile-sidebar").hide();
        }),
        $(".user-profile-show").click(function () {
            $(".user-profile-sidebar").show();
        })
})
!(function (e) {
    "use strict";
    var o, t;
    e(".dropdown-menu a.dropdown-toggle").on("click", function (t) {
        return e(this).next().hasClass("show") || e(this).parents(".dropdown-menu").first().find(".show").removeClass("show"), e(this).next(".dropdown-menu").toggleClass("show"), !1;
    }),
        [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (t) {
            return new bootstrap.Tooltip(t);
        }),
        [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')).map(function (t) {
            return new bootstrap.Popover(t);
        }),
        (o = document.getElementsByTagName("body")[0]),
    (t = document.querySelectorAll(".light-dark-mode")) &&
    t.length &&
    t.forEach(function (t) {
        t.addEventListener("click", function (t) {
            o.hasAttribute("data-layout-mode") && "dark" == o.getAttribute("data-layout-mode") ? document.body.setAttribute("data-layout-mode", "light") : document.body.setAttribute("data-layout-mode", "dark");
        });
    }),
        Waves.init();
})(jQuery);