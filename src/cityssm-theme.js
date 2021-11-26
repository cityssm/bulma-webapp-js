"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var logoutButtonEle = document.querySelector("#cityssm-theme--logout-button");
    if (logoutButtonEle) {
        logoutButtonEle.addEventListener("click", function (clickEvent) {
            clickEvent.preventDefault();
            cityssm.confirmModal("Log Out?", "<p>Are you sure you want to log out?</p>", "<span class=\"icon\"><i class=\"fas fa-sign-out-alt\" aria-hidden=\"true\"></i></span><span>Log Out</span>", "warning", function () {
                var urlPrefix = document.querySelector("main").getAttribute("data-url-prefix") || "";
                window.localStorage.clear();
                window.location.href = urlPrefix + "/logout";
            });
        });
    }
})();
(function () {
    var localStoragePropertyName = "collapseSidemenu";
    var collapseButtonEle = document.querySelector("#cityssm-theme--sidemenu-collapse-button");
    var collapseSidemenuEle = document.querySelector("#cityssm-theme--sidemenu-collapsed");
    var expandButtonEle = document.querySelector("#cityssm-theme--sidemenu-expand-button");
    var expandSidemenuEle = document.querySelector("#cityssm-theme--sidemenu-expanded");
    var collapseFunction = function (clickEvent) {
        expandSidemenuEle.classList.add("is-hidden");
        collapseSidemenuEle.classList.remove("is-hidden");
        try {
            window.localStorage.setItem(localStoragePropertyName, "true");
        }
        catch (_error) {
        }
        if (clickEvent) {
            expandButtonEle.focus();
        }
    };
    var expandFunction = function () {
        collapseSidemenuEle.classList.add("is-hidden");
        expandSidemenuEle.classList.remove("is-hidden");
        try {
            window.localStorage.removeItem(localStoragePropertyName);
        }
        catch (_error) {
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
        }
        catch (_error) {
        }
    }
})();
(function () {
    var keepAliveMillis = document.querySelector("main").getAttribute("data-session-keep-alive-millis");
    if (keepAliveMillis && keepAliveMillis !== "0") {
        var urlPrefix_1 = document.querySelector("main").getAttribute("data-url-prefix") || "";
        var keepAliveFunction = function () {
            cityssm.postJSON(urlPrefix_1 + "/keepAlive", {
                t: Date.now()
            }, function () { });
        };
        window.setInterval(keepAliveFunction, Number.parseInt(keepAliveMillis, 10));
    }
})();
