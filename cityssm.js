(function () {
    const cityssm = {};
    cityssm.clearElement = function (ele) {
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
    };
    cityssm.escapeHTML = function (str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };
    cityssm.dateToString = function (dateObj) {
        return dateObj.getFullYear() + "-" +
            ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" +
            ("0" + (dateObj.getDate())).slice(-2);
    };
    cityssm.responseToJSON = function (response) {
        return response.json();
    };
    cityssm.postJSON = function (fetchUrl, formEleOrObj, responseFn) {
        const fetchOptions = {
            method: "POST",
            credentials: "include"
        };
        if (formEleOrObj) {
            if (formEleOrObj.tagName && formEleOrObj.tagName === "FORM") {
                if (formEleOrObj.querySelector("input[name][type='file']")) {
                    fetchOptions.body = new FormData(formEleOrObj);
                }
                else {
                    fetchOptions.body = new URLSearchParams(new FormData(formEleOrObj));
                }
            }
            else if (formEleOrObj.constructor === Object) {
                fetchOptions.headers = {
                    "Content-Type": "application/json"
                };
                fetchOptions.body = JSON.stringify(formEleOrObj);
            }
        }
        window.fetch(fetchUrl, fetchOptions)
            .then(cityssm.responseToJSON)
            .then(responseFn);
    };
    cityssm.showModal = function (modalEle) {
        modalEle.classList.add("is-active");
    };
    cityssm.hideModal = function (internalEle_or_internalEvent) {
        const internalEle = internalEle_or_internalEvent.currentTarget || internalEle_or_internalEvent;
        const modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));
        modalEle.classList.remove("is-active");
    };
    cityssm.openHtmlModal = function (htmlFileName, callbackFns) {
        window.fetch("/html/" + htmlFileName + ".html")
            .then(function (response) {
            return response.text();
        })
            .then(function (modalHTML) {
            const modalContainerEle = document.createElement("div");
            modalContainerEle.innerHTML = modalHTML;
            const modalEle = modalContainerEle.getElementsByClassName("modal")[0];
            document.body.insertAdjacentElement("beforeend", modalContainerEle);
            if (callbackFns && callbackFns.onshow) {
                callbackFns.onshow(modalEle);
            }
            modalEle.classList.add("is-active");
            const closeModalFn = function () {
                const modalWasShown = modalEle.classList.contains("is-active");
                if (callbackFns && callbackFns.onhide && modalWasShown) {
                    const doHide = callbackFns.onhide(modalEle);
                    if (doHide) {
                        return;
                    }
                }
                modalEle.classList.remove("is-active");
                if (callbackFns && callbackFns.onhidden && modalWasShown) {
                    callbackFns.onhidden(modalEle);
                }
                modalContainerEle.remove();
                if (callbackFns && callbackFns.onremoved) {
                    callbackFns.onremoved();
                }
            };
            if (callbackFns && callbackFns.onshown) {
                callbackFns.onshown(modalEle, closeModalFn);
            }
            const closeModalBtnEles = modalEle.getElementsByClassName("is-close-modal-button");
            for (let btnIndex = 0; btnIndex < closeModalBtnEles.length; btnIndex += 1) {
                closeModalBtnEles[btnIndex].addEventListener("click", closeModalFn);
            }
        });
    };
    let isNavBlockerEnabled = false;
    function navBlockerEventFn(e) {
        const confirmationMessage = "You have unsaved changes that may be lost.";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }
    cityssm.enableNavBlocker = function () {
        if (!isNavBlockerEnabled) {
            window.addEventListener("beforeunload", navBlockerEventFn);
            isNavBlockerEnabled = true;
        }
    };
    cityssm.disableNavBlocker = function () {
        if (isNavBlockerEnabled) {
            window.removeEventListener("beforeunload", navBlockerEventFn);
            isNavBlockerEnabled = false;
        }
    };
    function confirmModalFn(modalOptions) {
        const modalEle = document.createElement("div");
        modalEle.className = "modal is-active";
        const contextualColorName = modalOptions.contextualColorName || "info";
        const titleString = modalOptions.titleString || "";
        const bodyHTML = modalOptions.bodyHTML || "";
        const cancelButtonHTML = modalOptions.cancelButtomHTML || "Cancel";
        const okButtonHTML = modalOptions.okButtonHTML || "OK";
        modalEle.innerHTML = "<div class=\"modal-background\"></div>" +
            "<div class=\"modal-content\">" +
            "<div class=\"message is-" + contextualColorName + "\">" +
            ("<header class=\"message-header\">" +
                "<span class=\"is-size-5\"></span>" +
                "</header>") +
            ("<section class=\"message-body\">" +
                (bodyHTML === "" ? "" : "<div class=\"has-margin-bottom-20\">" + bodyHTML + "</div>") +
                ("<div class=\"buttons justify-flex-end\">" +
                    (modalOptions.hideCancelButton ?
                        "" :
                        "<button class=\"button is-cancel-button\" type=\"button\" aria-label=\"Cancel\">" +
                            cancelButtonHTML +
                            "</button>") +
                    ("<button class=\"button is-ok-button is-" + contextualColorName + "\" type=\"button\" aria-label=\"OK\">" +
                        okButtonHTML +
                        "</button>") +
                    "</div>") +
                "</section>") +
            "</div>" +
            "</div>";
        modalEle.getElementsByClassName("message-header")[0].getElementsByTagName("span")[0].innerText = titleString;
        if (!modalOptions.hideCancelButton) {
            modalEle.getElementsByClassName("is-cancel-button")[0].addEventListener("click", function () {
                modalEle.remove();
            });
        }
        const okButtonEle = modalEle.getElementsByClassName("is-ok-button")[0];
        okButtonEle.addEventListener("click", function () {
            modalEle.remove();
            if (modalOptions.callbackFn) {
                modalOptions.callbackFn();
            }
        });
        document.body.insertAdjacentElement("beforeend", modalEle);
        okButtonEle.focus();
    }
    cityssm.confirmModal = function (titleString, bodyHTML, okButtonHTML, contextualColorName, callbackFn) {
        confirmModalFn({
            contextualColorName: contextualColorName,
            titleString: titleString,
            bodyHTML: bodyHTML,
            okButtonHTML: okButtonHTML,
            callbackFn: callbackFn
        });
    };
    cityssm.alertModal = function (titleString, bodyHTML, okButtonHTML, contextualColorName) {
        confirmModalFn({
            contextualColorName: contextualColorName,
            titleString: titleString,
            bodyHTML: bodyHTML,
            hideCancelButton: true,
            okButtonHTML: okButtonHTML
        });
    };
    window.cityssm = window.cityssm || cityssm;
}());
