"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var navbarEle = document.getElementById("cityssm-theme--navbar");
    if (navbarEle) {
        navbarEle.querySelector(".navbar-burger").addEventListener("click", function (clickEvent) {
            clickEvent.currentTarget.classList.toggle("is-active");
            navbarEle.querySelector(".navbar-menu").classList.toggle("is-active");
        });
    }
})();
(function () {
    var logoutButtonEle = document.getElementById("cityssm-theme--logout-button");
    if (logoutButtonEle) {
        logoutButtonEle.addEventListener("click", function (clickEvent) {
            clickEvent.preventDefault();
            cityssm.confirmModal("Log Out?", "<p>Are you sure you want to log out?</p>", "<span class=\"icon\"><i class=\"fas fa-sign-out-alt\" aria-hidden=\"true\"></i></span><span>Log Out</span>", "warning", function () {
                var urlPrefix = document.querySelector("main").getAttribute("data-url-prefix");
                window.localStorage.clear();
                window.location.href = urlPrefix + "/logout";
            });
        });
    }
})();
(function () {
    var localStoragePropertyName = "collapseSidemenu";
    var collapseButtonEle = document.getElementById("cityssm-theme--sidemenu-collapse-button");
    var collapseSidemenuEle = document.getElementById("cityssm-theme--sidemenu-collapsed");
    var expandButtonEle = document.getElementById("cityssm-theme--sidemenu-expand-button");
    var expandSidemenuEle = document.getElementById("cityssm-theme--sidemenu-expanded");
    var collapseFn = function () {
        expandSidemenuEle.classList.add("is-hidden");
        collapseSidemenuEle.classList.remove("is-hidden");
        try {
            window.localStorage.setItem(localStoragePropertyName, "true");
        }
        catch (_e) {
        }
    };
    var expandFn = function () {
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
(function () {
    var keepAliveMillis = document.querySelector("main").getAttribute("data-session-keep-alive-millis");
    if (keepAliveMillis && keepAliveMillis !== "0") {
        var urlPrefix_1 = document.querySelector("main").getAttribute("data-url-prefix");
        var keepAliveFn = function () {
            cityssm.postJSON(urlPrefix_1 + "/keepAlive", {
                t: Date.now()
            }, function () { });
        };
        window.setInterval(keepAliveFn, parseInt(keepAliveMillis, 10));
    }
})();
