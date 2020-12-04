"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                ("<div class=\"buttons is-block has-text-right\">" +
                    (modalOptions.hideCancelButton
                        ? ""
                        : "<button class=\"button is-cancel-button\" type=\"button\" aria-label=\"Cancel\">" +
                            cancelButtonHTML +
                            "</button>") +
                    ("<button class=\"button is-ok-button is-" + contextualColorName + "\" type=\"button\" aria-label=\"OK\">" +
                        okButtonHTML +
                        "</button>") +
                    "</div>") +
                "</section>") +
            "</div>" +
            "</div>";
        modalEle.querySelector(".message-header").querySelector("span").innerText = titleString;
        if (!modalOptions.hideCancelButton) {
            modalEle.querySelector(".is-cancel-button").addEventListener("click", () => {
                modalEle.remove();
            });
        }
        const okButtonEle = modalEle.querySelector(".is-ok-button");
        okButtonEle.addEventListener("click", () => {
            modalEle.remove();
            if (modalOptions.callbackFn) {
                modalOptions.callbackFn();
            }
        });
        document.body.insertAdjacentElement("beforeend", modalEle);
        okButtonEle.focus();
    };
    const csrfTokenEle = document.querySelector("meta[name='csrf-token']");
    const csrfToken = (csrfTokenEle ? csrfTokenEle.getAttribute("content") : "");
    const cityssm = {
        clearElement: (ele) => {
            while (ele.firstChild) {
                ele.removeChild(ele.firstChild);
            }
        },
        escapeHTML: (str) => {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        },
        dateToString: (dateObj) => {
            return dateObj.getFullYear().toString() + "-" +
                ("0" + (dateObj.getMonth() + 1).toString()).slice(-2) + "-" +
                ("0" + (dateObj.getDate().toString())).slice(-2);
        },
        dateStringToDate: (dateString) => {
            const datePieces = dateString.split("-");
            return new Date(parseInt(datePieces[0], 10), parseInt(datePieces[1], 10) - 1, parseInt(datePieces[2], 10));
        },
        dateStringDifferenceInDays: (fromDateString, toDateString) => {
            const fromDate = cityssm.dateStringToDate(fromDateString);
            const toDate = cityssm.dateStringToDate(toDateString);
            return Math.round((toDate.getTime() - fromDate.getTime()) / (86400 * 1000.0));
        },
        responseToJSON: (response) => __awaiter(void 0, void 0, void 0, function* () {
            return yield response.json();
        }),
        postJSON: (fetchUrl, formEleOrObj, responseFn) => {
            const fetchOptions = {
                credentials: "same-origin",
                headers: {
                    "CSRF-Token": csrfToken
                },
                method: "POST"
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
                    fetchOptions.headers["Content-Type"] = "application/json";
                    fetchOptions.body = JSON.stringify(formEleOrObj);
                }
            }
            window.fetch(fetchUrl, fetchOptions)
                .then(cityssm.responseToJSON)
                .then(responseFn)
                .catch(() => {
                cityssm.alertModal("Error", "Error communicating with the server.", "OK", "danger");
            });
        },
        showModal: (modalEle) => {
            modalEle.classList.add("is-active");
        },
        hideModal: (internalEle_or_internalEvent) => {
            let internalEle = internalEle_or_internalEvent;
            if (internalEle instanceof Event) {
                internalEle = internalEle_or_internalEvent.currentTarget;
            }
            const modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));
            modalEle.classList.remove("is-active");
        },
        htmlModalFolder: "/html/",
        openHtmlModal: (htmlFileName, callbackFns) => {
            window.fetch(cityssm.htmlModalFolder + htmlFileName + ".html")
                .then((response) => __awaiter(void 0, void 0, void 0, function* () { return yield response.text(); }))
                .then((modalHTML) => __awaiter(void 0, void 0, void 0, function* () {
                const modalContainerEle = document.createElement("div");
                modalContainerEle.innerHTML = modalHTML;
                const modalEle = modalContainerEle.querySelector(".modal");
                document.body.insertAdjacentElement("beforeend", modalContainerEle);
                if (callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onshow) {
                    callbackFns.onshow(modalEle);
                }
                modalEle.classList.add("is-active");
                const closeModalFn = () => {
                    const modalWasShown = modalEle.classList.contains("is-active");
                    if ((callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onhide) && modalWasShown) {
                        const doHide = callbackFns.onhide(modalEle);
                        if (doHide) {
                            return;
                        }
                    }
                    modalEle.classList.remove("is-active");
                    if ((callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onhidden) && modalWasShown) {
                        callbackFns.onhidden(modalEle);
                    }
                    modalContainerEle.remove();
                    if (callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onremoved) {
                        callbackFns.onremoved();
                    }
                };
                if (callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onshown) {
                    callbackFns.onshown(modalEle, closeModalFn);
                }
                const closeModalBtnEles = modalEle.getElementsByClassName("is-close-modal-button");
                for (const closeModalBtnEle of closeModalBtnEles) {
                    closeModalBtnEle.addEventListener("click", closeModalFn);
                }
            }))
                .catch(() => {
                cityssm.alertModal("Error", "Error loading popup.", "OK", "danger");
            });
        },
        enableNavBlocker: () => {
            if (!isNavBlockerEnabled) {
                window.addEventListener("beforeunload", navBlockerEventFn);
                isNavBlockerEnabled = true;
            }
        },
        disableNavBlocker: () => {
            if (isNavBlockerEnabled) {
                window.removeEventListener("beforeunload", navBlockerEventFn);
                isNavBlockerEnabled = false;
            }
        },
        isNavBlockerEnabled: () => {
            return isNavBlockerEnabled;
        },
        confirmModal: (titleString, bodyHTML, okButtonHTML, contextualColorName, callbackFn) => {
            confirmModalFn({
                bodyHTML,
                callbackFn,
                contextualColorName,
                okButtonHTML,
                titleString
            });
        },
        alertModal: (titleString, bodyHTML, okButtonHTML, contextualColorName) => {
            confirmModalFn({
                bodyHTML,
                contextualColorName,
                hideCancelButton: true,
                okButtonHTML,
                titleString
            });
        }
    };
    window.cityssm = window.cityssm || cityssm;
})();
