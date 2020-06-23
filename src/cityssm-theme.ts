import type { cityssmGlobal } from "./types";

declare const cityssm: cityssmGlobal;


/*
* NAVBAR TOGGLE
*/


(function() {

  const navbarEle = document.getElementById("cityssm-theme--navbar");

  if (navbarEle) {
    navbarEle.getElementsByClassName("navbar-burger")[0].addEventListener("click", function(clickEvent) {

      (<Element>clickEvent.currentTarget).classList.toggle("is-active");
      navbarEle.getElementsByClassName("navbar-menu")[0].classList.toggle("is-active");
    });
  }

}());


/*
 * LOGOUT MODAL
 */


(function() {

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


/*
 * SIDE MENU INIT
 */


(function() {

  const localStoragePropertyName = "collapseSidemenu";

  const collapseButtonEle = document.getElementById("cityssm-theme--sidemenu-collapse-button");
  const collapseSidemenuEle = document.getElementById("cityssm-theme--sidemenu-collapsed");

  const expandButtonEle = document.getElementById("cityssm-theme--sidemenu-expand-button");
  const expandSidemenuEle = document.getElementById("cityssm-theme--sidemenu-expanded");

  const collapseFn = function() {

    expandSidemenuEle.classList.add("is-hidden");
    collapseSidemenuEle.classList.remove("is-hidden");

    try {
      window.localStorage.setItem(localStoragePropertyName, "true");

    } catch (_e) {
      // ignore
    }

  };

  const expandFn = function() {

    collapseSidemenuEle.classList.add("is-hidden");
    expandSidemenuEle.classList.remove("is-hidden");

    try {
      window.localStorage.removeItem(localStoragePropertyName);

    } catch (_e) {
      // Ignore
    }

  };

  if (collapseButtonEle && collapseSidemenuEle && expandButtonEle && expandSidemenuEle) {

    collapseButtonEle.addEventListener("click", collapseFn);
    expandButtonEle.addEventListener("click", expandFn);

    try {
      if (window.localStorage.getItem(localStoragePropertyName)) {
        collapseFn();
      }

    } catch (_e) {
      // Ignore
    }
  }
}());


/*
 * KEEP ALIVE
 */


(function() {

  const keepAliveMillis = document.getElementsByTagName("main")[0].getAttribute("data-session-keep-alive-millis");

  if (keepAliveMillis && keepAliveMillis !== "0") {

    const keepAliveFn = function() {

      cityssm.postJSON("/keepAlive", {
        t: Date.now()
      }, function() {

        // No action
      });
    };

    window.setInterval(keepAliveFn, parseInt(keepAliveMillis, 10));
  }
}());
