"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var navbarEle = document.getElementById("cityssm-theme--navbar");
    if (navbarEle) {
        navbarEle.getElementsByClassName("navbar-burger")[0].addEventListener("click", function (clickEvent) {
            clickEvent.currentTarget.classList.toggle("is-active");
            navbarEle.getElementsByClassName("navbar-menu")[0].classList.toggle("is-active");
        });
    }
}());
(function () {
    var logoutButtonEle = document.getElementById("cityssm-theme--logout-button");
    if (logoutButtonEle) {
        logoutButtonEle.addEventListener("click", function (clickEvent) {
            clickEvent.preventDefault();
            cityssm.confirmModal("Log Out?", "<p>Are you sure you want to log out?</p>", "<span class=\"icon\"><i class=\"fas fa-sign-out-alt\" aria-hidden=\"true\"></i></span><span>Log Out</span>", "warning", function () {
                window.localStorage.clear();
                window.location.href = "/logout";
            });
        });
    }
}());
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
        catch (e) {
        }
    };
    var expandFn = function () {
        collapseSidemenuEle.classList.add("is-hidden");
        expandSidemenuEle.classList.remove("is-hidden");
        try {
            window.localStorage.removeItem(localStoragePropertyName);
        }
        catch (e) {
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
        catch (e) {
        }
    }
}());
(function () {
    var keepAliveMillis = document.getElementsByTagName("main")[0].getAttribute("data-session-keep-alive-millis");
    if (keepAliveMillis && keepAliveMillis !== "0") {
        var keepAliveFn = function () {
            cityssm.postJSON("/keepAlive", {
                t: Date.now()
            }, function () {
            });
        };
        window.setInterval(keepAliveFn, parseInt(keepAliveMillis, 10));
    }
}());
