import type { cityssmGlobal } from "./types";

declare const cityssm: cityssmGlobal;


/*
 * LOGOUT MODAL
 */


(() => {

  const logoutButtonEle = document.querySelector("#cityssm-theme--logout-button");

  if (logoutButtonEle) {

    logoutButtonEle.addEventListener("click", (clickEvent) => {

      clickEvent.preventDefault();

      cityssm.confirmModal(
        "Log Out?",
        "<p>Are you sure you want to log out?</p>",
        "<span class=\"icon\"><i class=\"fas fa-sign-out-alt\" aria-hidden=\"true\"></i></span><span>Log Out</span>",
        "warning",
        () => {
          const urlPrefix = document.querySelector("main").getAttribute("data-url-prefix") || "";

          window.localStorage.clear();
          window.location.href = urlPrefix + "/logout";
        });
    });
  }
})();


/*
 * SIDE MENU INIT
 */


(() => {

  const localStoragePropertyName = "collapseSidemenu";

  const collapseButtonEle = document.querySelector("#cityssm-theme--sidemenu-collapse-button") as HTMLButtonElement;
  const collapseSidemenuEle = document.querySelector("#cityssm-theme--sidemenu-collapsed");

  const expandButtonEle = document.querySelector("#cityssm-theme--sidemenu-expand-button") as HTMLButtonElement;
  const expandSidemenuEle = document.querySelector("#cityssm-theme--sidemenu-expanded");

  const collapseFunction = (clickEvent?: Event) => {

    expandSidemenuEle.classList.add("is-hidden");
    collapseSidemenuEle.classList.remove("is-hidden");

    try {
      window.localStorage.setItem(localStoragePropertyName, "true");

    } catch (_error) {
      // ignore
    }

    if (clickEvent) {
      expandButtonEle.focus();
    }
  };

  const expandFunction = () => {

    collapseSidemenuEle.classList.add("is-hidden");
    expandSidemenuEle.classList.remove("is-hidden");

    try {
      window.localStorage.removeItem(localStoragePropertyName);

    } catch (_error) {
      // Ignore
    }

    collapseButtonEle.focus();
  };

  if (collapseButtonEle && collapseSidemenuEle && expandButtonEle && expandSidemenuEle) {

    collapseButtonEle.addEventListener("click", collapseFunction);
    expandButtonEle.addEventListener("click", expandFunction);

    try {
      if (window.localStorage.getItem(localStoragePropertyName)) {
        collapseFunction();
      }

    } catch (_error) {
      // Ignore
    }
  }
})();


/*
 * KEEP ALIVE
 */


(() => {

  const keepAliveMillis = document.querySelector("main").getAttribute("data-session-keep-alive-millis");

  if (keepAliveMillis && keepAliveMillis !== "0") {

    const urlPrefix = document.querySelector("main").getAttribute("data-url-prefix") || "";

    const keepAliveFunction = () => {

      cityssm.postJSON(urlPrefix + "/keepAlive", {
        t: Date.now()
      },
        () => { });
    };

    window.setInterval(keepAliveFunction, Number.parseInt(keepAliveMillis, 10));
  }
})();
