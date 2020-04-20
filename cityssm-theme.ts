declare const cityssm: {

  confirmModal: (titleString: string,
    bodyHTML: string,
    okButtonHTML: string,
    contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger",
    callbackFn: () => void) => void

};


(function() {


  /*
   * NAVBAR TOGGLE
   */

  const navbarEle = document.getElementById("cityssm-theme--navbar");

  if (navbarEle) {
    navbarEle.getElementsByClassName("navbar-burger")[0].addEventListener("click", function(clickEvent) {

      (<Element>clickEvent.currentTarget).classList.toggle("is-active");
      navbarEle.getElementsByClassName("navbar-menu")[0].classList.toggle("is-active");

    });
  }


  /*
   * LOGOUT MODAL
   */


  const logoutButtonEle = document.getElementById("cityssm-theme--logout-button");

  if (logoutButtonEle) {

    logoutButtonEle.addEventListener("click", function(clickEvent) {

      clickEvent.preventDefault();

      cityssm.confirmModal(
        "Log Out?",
        "<p>Are you sure you want to log out?</p>",
        "<span class=\"icon\"><i class=\"fas fa-sign-out-alt\" aria-hidden=\"true\"></i></span><span>Log Out</span>",
        "warning",
        function() {

          window.localStorage.clear();
          window.location.href = "/logout";

        }
      );

    });
  }


}());
