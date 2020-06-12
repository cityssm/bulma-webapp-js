"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var isNavBlockerEnabled = false;
    function navBlockerEventFn(e) {
        var confirmationMessage = "You have unsaved changes that may be lost.";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }
    function confirmModalFn(modalOptions) {
        var modalEle = document.createElement("div");
        modalEle.className = "modal is-active";
        var contextualColorName = modalOptions.contextualColorName || "info";
        var titleString = modalOptions.titleString || "";
        var bodyHTML = modalOptions.bodyHTML || "";
        var cancelButtonHTML = modalOptions.cancelButtonHTML || "Cancel";
        var okButtonHTML = modalOptions.okButtonHTML || "OK";
        modalEle.innerHTML = "<div class=\"modal-background\"></div>" +
            "<div class=\"modal-content\">" +
            "<div class=\"message is-" + contextualColorName + "\">" +
            ("<header class=\"message-header\">" +
                "<span class=\"is-size-5\"></span>" +
                "</header>") +
            ("<section class=\"message-body\">" +
                (bodyHTML === "" ? "" : "<div class=\"mb-4\">" + bodyHTML + "</div>") +
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
        var okButtonEle = modalEle.getElementsByClassName("is-ok-button")[0];
        okButtonEle.addEventListener("click", function () {
            modalEle.remove();
            if (modalOptions.callbackFn) {
                modalOptions.callbackFn();
            }
        });
        document.body.insertAdjacentElement("beforeend", modalEle);
        okButtonEle.focus();
    }
    var cityssm = {
        clearElement: function (ele) {
            while (ele.firstChild) {
                ele.removeChild(ele.firstChild);
            }
        },
        escapeHTML: function (str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        },
        dateToString: function (dateObj) {
            return dateObj.getFullYear() + "-" +
                ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" +
                ("0" + (dateObj.getDate())).slice(-2);
        },
        dateStringToDate: function (dateString) {
            var datePieces = dateString.split("-");
            return new Date(parseInt(datePieces[0], 10), parseInt(datePieces[1], 10) - 1, parseInt(datePieces[2], 10), 0, 0, 0, 0);
        },
        dateStringDifferenceInDays: function (fromDateString, toDateString) {
            var fromDate = cityssm.dateStringToDate(fromDateString);
            var toDate = cityssm.dateStringToDate(toDateString);
            return Math.round((toDate.getTime() - fromDate.getTime()) / (86400 * 1000.0));
        },
        responseToJSON: function (response) {
            return response.json();
        },
        postJSON: function (fetchUrl, formEleOrObj, responseFn) {
            var fetchOptions = {
                method: "POST",
                credentials: "include"
            };
            if (formEleOrObj) {
                if (formEleOrObj instanceof HTMLFormElement) {
                    var formEle = formEleOrObj;
                    if (formEle.querySelector("input[name][type='file']")) {
                        fetchOptions.body = new FormData(formEle);
                    }
                    else {
                        fetchOptions.body = new URLSearchParams(new FormData(formEle));
                    }
                }
                else if (formEleOrObj instanceof Object) {
                    fetchOptions.headers = {
                        "Content-Type": "application/json"
                    };
                    fetchOptions.body = JSON.stringify(formEleOrObj);
                }
            }
            window.fetch(fetchUrl, fetchOptions)
                .then(cityssm.responseToJSON)
                .then(responseFn);
        },
        showModal: function (modalEle) {
            modalEle.classList.add("is-active");
        },
        hideModal: function (internalEle_or_internalEvent) {
            var internalEle = internalEle_or_internalEvent;
            if (internalEle instanceof Event) {
                internalEle = internalEle_or_internalEvent.currentTarget;
            }
            var modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));
            modalEle.classList.remove("is-active");
        },
        openHtmlModal: function (htmlFileName, callbackFns) {
            window.fetch("/html/" + htmlFileName + ".html")
                .then(function (response) {
                return response.text();
            })
                .then(function (modalHTML) {
                var modalContainerEle = document.createElement("div");
                modalContainerEle.innerHTML = modalHTML;
                var modalEle = modalContainerEle.getElementsByClassName("modal")[0];
                document.body.insertAdjacentElement("beforeend", modalContainerEle);
                if (callbackFns && callbackFns.onshow) {
                    callbackFns.onshow(modalEle);
                }
                modalEle.classList.add("is-active");
                var closeModalFn = function () {
                    var modalWasShown = modalEle.classList.contains("is-active");
                    if (callbackFns && callbackFns.onhide && modalWasShown) {
                        var doHide = callbackFns.onhide(modalEle);
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
                var closeModalBtnEles = modalEle.getElementsByClassName("is-close-modal-button");
                for (var btnIndex = 0; btnIndex < closeModalBtnEles.length; btnIndex += 1) {
                    closeModalBtnEles[btnIndex].addEventListener("click", closeModalFn);
                }
            });
        },
        enableNavBlocker: function () {
            if (!isNavBlockerEnabled) {
                window.addEventListener("beforeunload", navBlockerEventFn);
                isNavBlockerEnabled = true;
            }
        },
        disableNavBlocker: function () {
            if (isNavBlockerEnabled) {
                window.removeEventListener("beforeunload", navBlockerEventFn);
                isNavBlockerEnabled = false;
            }
        },
        confirmModal: function (titleString, bodyHTML, okButtonHTML, contextualColorName, callbackFn) {
            confirmModalFn({
                contextualColorName: contextualColorName,
                titleString: titleString,
                bodyHTML: bodyHTML,
                okButtonHTML: okButtonHTML,
                callbackFn: callbackFn
            });
        },
        alertModal: function (titleString, bodyHTML, okButtonHTML, contextualColorName) {
            confirmModalFn({
                contextualColorName: contextualColorName,
                titleString: titleString,
                bodyHTML: bodyHTML,
                hideCancelButton: true,
                okButtonHTML: okButtonHTML
            });
        }
    };
    window.cityssm = window.cityssm || cityssm;
}());
