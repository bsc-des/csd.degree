function accordion(accordionId) {
  var headers = document.querySelectorAll("#" + accordionId + " .header");

  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener("click", function () {
      var parentId = this.parentNode.parentNode.id;

      if (this.parentNode.classList.contains("current-accordion-item")) {
        clearAll(parentId);
      } else {
        clearAll(parentId);

        this.closest(".accordion-item").classList.add("current-accordion-item");

        var sectionHeight = document.querySelectorAll(
          "#" + parentId + " .current-accordion-item .body-text"
        )[0].offsetHeight;

        document
          .querySelectorAll(
            "#" + parentId + " .current-accordion-item .body"
          )[0]
          .setAttribute("style", "height: " + sectionHeight + "px");
      }
    });

    var clearAll = function (selector) {
      var currentlyDisplayed = document.querySelectorAll(
        "#" + selector + " .current-accordion-item"
      );
      var currentSection = document.querySelectorAll(
        "#" + selector + " .current-accordion-item .body"
      )[0];

      for (var e = 0; e < currentlyDisplayed.length; e++) {
        currentlyDisplayed[e].classList.remove("current-accordion-item");

        currentSection.setAttribute("style", "height: 0px");
      }
    };

    var resizeAccordion = function () {
      var accordions = document.getElementsByClassName("accordion");

      for (var a = 0; a < accordions.length; a++) {
        var newHeight = document.querySelectorAll(
          ".accordion .current-accordion-item .body-text"
        )[a].offsetHeight;

        document
          .querySelectorAll(".accordion .current-accordion-item .body")
          [a].setAttribute("style", "height: " + newHeight + "px");
      }
    };

    resizeAccordion();

    window.onresize = resizeAccordion;
  }
}
