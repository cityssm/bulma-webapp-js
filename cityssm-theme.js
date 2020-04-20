(function () {
    var navbarEle = document.getElementById("cityssm-theme--navbar");
    if (navbarEle) {
        navbarEle.getElementsByClassName("navbar-burger")[0].addEventListener("click", function (clickEvent) {
            clickEvent.currentTarget.classList.toggle("is-active");
            navbarEle.getElementsByClassName("navbar-menu")[0].classList.toggle("is-active");
        });
    }
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
    var collapseButtonEle = document.getElementById("cityssm-theme--sidemenu-collapse-button");
    var collapseSidemenuEle = document.getElementById("cityssm-theme--sidemenu-collapsed");
    var expandButtonEle = document.getElementById("cityssm-theme--sidemenu-expand-button");
    var expandSidemenuEle = document.getElementById("cityssm-theme--sidemenu-expanded");
    if (collapseButtonEle && collapseSidemenuEle && expandButtonEle && expandSidemenuEle) {
        collapseButtonEle.addEventListener("click", function () {
            expandSidemenuEle.classList.add("is-hidden");
            collapseSidemenuEle.classList.remove("is-hidden");
        });
        expandButtonEle.addEventListener("click", function () {
            collapseSidemenuEle.classList.add("is-hidden");
            expandSidemenuEle.classList.remove("is-hidden");
        });
    }
}());
