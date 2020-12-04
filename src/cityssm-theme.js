"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const navbarEle = document.getElementById("cityssm-theme--navbar");
    if (navbarEle) {
        navbarEle.querySelector(".navbar-burger").addEventListener("click", (clickEvent) => {
            clickEvent.currentTarget.classList.toggle("is-active");
            navbarEle.querySelector(".navbar-menu").classList.toggle("is-active");
        });
    }
})();
(() => {
    const logoutButtonEle = document.getElementById("cityssm-theme--logout-button");
    if (logoutButtonEle) {
        logoutButtonEle.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            cityssm.confirmModal("Log Out?", "<p>Are you sure you want to log out?</p>", "<span class=\"icon\"><i class=\"fas fa-sign-out-alt\" aria-hidden=\"true\"></i></span><span>Log Out</span>", "warning", () => {
                const urlPrefix = document.querySelector("main").getAttribute("data-url-prefix");
                window.localStorage.clear();
                window.location.href = urlPrefix + "/logout";
            });
        });
    }
})();
(() => {
    const localStoragePropertyName = "collapseSidemenu";
    const collapseButtonEle = document.getElementById("cityssm-theme--sidemenu-collapse-button");
    const collapseSidemenuEle = document.getElementById("cityssm-theme--sidemenu-collapsed");
    const expandButtonEle = document.getElementById("cityssm-theme--sidemenu-expand-button");
    const expandSidemenuEle = document.getElementById("cityssm-theme--sidemenu-expanded");
    const collapseFn = () => {
        expandSidemenuEle.classList.add("is-hidden");
        collapseSidemenuEle.classList.remove("is-hidden");
        try {
            window.localStorage.setItem(localStoragePropertyName, "true");
        }
        catch (_e) {
        }
    };
    const expandFn = () => {
        collapseSidemenuEle.classList.add("is-hidden");
        expandSidemenuEle.classList.remove("is-hidden");
        try {
            window.localStorage.removeItem(localStoragePropertyName);
        }
        catch (_e) {
        }
    };
    if (collapseButtonEle && collapseSidemenuEle && expandButtonEle && expandSidemenuEle) {
        collapseButtonEle.addEventListener("click", collapseFn);
        expandButtonEle.addEventListener("click", expandFn);
        try {
            if (window.localStorage.getItem(localStoragePropertyName)) {
                collapseFn();
            }
        }
        catch (_e) {
        }
    }
})();
(() => {
    const keepAliveMillis = document.querySelector("main").getAttribute("data-session-keep-alive-millis");
    if (keepAliveMillis && keepAliveMillis !== "0") {
        const urlPrefix = document.querySelector("main").getAttribute("data-url-prefix");
        const keepAliveFn = () => {
            cityssm.postJSON(urlPrefix + "/keepAlive", {
                t: Date.now()
            }, () => { });
        };
        window.setInterval(keepAliveFn, parseInt(keepAliveMillis, 10));
    }
})();
