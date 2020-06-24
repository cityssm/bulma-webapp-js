"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    let isNavBlockerEnabled = false;
    const navBlockerEventFn = (e) => {
        const confirmationMessage = "You have unsaved changes that may be lost.";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    };
    const confirmModalFn = (modalOptions) => {
        const modalEle = document.createElement("div");
        modalEle.className = "modal is-active";
        const contextualColorName = modalOptions.contextualColorName || "info";
        const titleString = modalOptions.titleString || "";
        const bodyHTML = modalOptions.bodyHTML || "";
        const cancelButtonHTML = modalOptions.cancelButtonHTML || "Cancel";
        const okButtonHTML = modalOptions.okButtonHTML || "OK";
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
            modalEle.getElementsByClassName("is-cancel-button")[0].addEventListener("click", () => {
                modalEle.remove();
            });
        }
        const okButtonEle = modalEle.getElementsByClassName("is-ok-button")[0];
        okButtonEle.addEventListener("click", () => {
            modalEle.remove();
            if (modalOptions.callbackFn) {
                modalOptions.callbackFn();
            }
        });
        document.body.insertAdjacentElement("beforeend", modalEle);
        okButtonEle.focus();
    };
    const cityssm = {
        clearElement(ele) {
            while (ele.firstChild) {
                ele.removeChild(ele.firstChild);
            }
        },
        escapeHTML(str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        },
        dateToString(dateObj) {
            return dateObj.getFullYear() + "-" +
                ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" +
                ("0" + (dateObj.getDate())).slice(-2);
        },
        dateStringToDate(dateString) {
            const datePieces = dateString.split("-");
            return new Date(parseInt(datePieces[0], 10), parseInt(datePieces[1], 10) - 1, parseInt(datePieces[2], 10), 0, 0, 0, 0);
        },
        dateStringDifferenceInDays(fromDateString, toDateString) {
            const fromDate = cityssm.dateStringToDate(fromDateString);
            const toDate = cityssm.dateStringToDate(toDateString);
            return Math.round((toDate.getTime() - fromDate.getTime()) / (86400 * 1000.0));
        },
        responseToJSON(response) {
            return response.json();
        },
        postJSON(fetchUrl, formEleOrObj, responseFn) {
            const fetchOptions = {
                method: "POST",
                credentials: "include"
            };
            if (formEleOrObj) {
                if (formEleOrObj instanceof HTMLFormElement) {
                    const formEle = formEleOrObj;
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
        showModal(modalEle) {
            modalEle.classList.add("is-active");
        },
        hideModal(internalEle_or_internalEvent) {
            let internalEle = internalEle_or_internalEvent;
            if (internalEle instanceof Event) {
                internalEle = internalEle_or_internalEvent.currentTarget;
            }
            const modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));
            modalEle.classList.remove("is-active");
        },
        openHtmlModal(htmlFileName, callbackFns) {
            window.fetch("/html/" + htmlFileName + ".html")
                .then((response) => response.text())
                .then((modalHTML) => {
                const modalContainerEle = document.createElement("div");
                modalContainerEle.innerHTML = modalHTML;
                const modalEle = modalContainerEle.getElementsByClassName("modal")[0];
                document.body.insertAdjacentElement("beforeend", modalContainerEle);
                if (callbackFns && callbackFns.onshow) {
                    callbackFns.onshow(modalEle);
                }
                modalEle.classList.add("is-active");
                const closeModalFn = () => {
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
                for (const closeModalBtnEle of closeModalBtnEles) {
                    closeModalBtnEle.addEventListener("click", closeModalFn);
                }
            });
        },
        enableNavBlocker() {
            if (!isNavBlockerEnabled) {
                window.addEventListener("beforeunload", navBlockerEventFn);
                isNavBlockerEnabled = true;
            }
        },
        disableNavBlocker() {
            if (isNavBlockerEnabled) {
                window.removeEventListener("beforeunload", navBlockerEventFn);
                isNavBlockerEnabled = false;
            }
        },
        confirmModal(titleString, bodyHTML, okButtonHTML, contextualColorName, callbackFn) {
            confirmModalFn({
                contextualColorName,
                titleString,
                bodyHTML,
                okButtonHTML,
                callbackFn
            });
        },
        alertModal(titleString, bodyHTML, okButtonHTML, contextualColorName) {
            confirmModalFn({
                contextualColorName,
                titleString,
                bodyHTML,
                hideCancelButton: true,
                okButtonHTML
            });
        }
    };
    window.cityssm = window.cityssm || cityssm;
})();
