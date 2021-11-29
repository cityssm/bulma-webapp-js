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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var isNavBlockerEnabled = false;
    var navBlockerEventFunction = function (event) {
        var confirmationMessage = "You have unsaved changes that may be lost.";
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    };
    var csrfTokenEle = document.querySelector("meta[name='csrf-token']");
    var csrfToken = (csrfTokenEle ? csrfTokenEle.getAttribute("content") : "");
    var cityssm = {
        clearElement: function (ele) {
            while (ele.firstChild) {
                ele.firstChild.remove();
            }
        },
        escapeHTML: function (str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        },
        dateToString: function (dateObject) {
            return dateObject.getFullYear().toString() + "-" +
                ("0" + (dateObject.getMonth() + 1).toString()).slice(-2) + "-" +
                ("0" + (dateObject.getDate().toString())).slice(-2);
        },
        dateToTimeString: function (dateObject) {
            return ("00" + (dateObject.getHours().toString())).slice(-2) +
                ":" +
                ("00" + (dateObject.getMinutes().toString())).slice(-2);
        },
        dateStringToDate: function (dateString) {
            var datePieces = dateString.split("-");
            return new Date(Number.parseInt(datePieces[0], 10), Number.parseInt(datePieces[1], 10) - 1, Number.parseInt(datePieces[2], 10));
        },
        dateStringDifferenceInDays: function (fromDateString, toDateString) {
            var fromDate = cityssm.dateStringToDate(fromDateString);
            var toDate = cityssm.dateStringToDate(toDateString);
            return Math.round((toDate.getTime() - fromDate.getTime()) / (86400 * 1000));
        },
        responseToJSON: function (response) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, response.json()];
                    case 1: return [2, _a.sent()];
                }
            });
        }); },
        postJSON: function (fetchUrl, formEleOrObj, responseFunction) {
            var fetchOptions = {
                credentials: "same-origin",
                headers: {
                    "CSRF-Token": csrfToken
                },
                method: "POST"
            };
            if (formEleOrObj) {
                if (formEleOrObj instanceof HTMLFormElement) {
                    var formEle = formEleOrObj;
                    if (formEle.querySelector("input[name][type='file']")) {
                        fetchOptions.body = new FormData(formEle);
                    }
                    else {
                        var formData = new FormData(formEle);
                        var object_1 = {};
                        formData.forEach(function (value, key) {
                            if (!Reflect.has(object_1, key)) {
                                object_1[key] = value;
                                return;
                            }
                            if (!Array.isArray(object_1[key])) {
                                object_1[key] = [object_1[key]];
                            }
                            object_1[key].push(value);
                        });
                        var json = JSON.stringify(object_1);
                        fetchOptions.headers["Content-Type"] = "application/json";
                        fetchOptions.body = json;
                    }
                }
                else if (formEleOrObj instanceof Object) {
                    fetchOptions.headers["Content-Type"] = "application/json";
                    fetchOptions.body = JSON.stringify(formEleOrObj);
                }
            }
            window.fetch(fetchUrl, fetchOptions)
                .then(cityssm.responseToJSON)
                .then(responseFunction)
                .catch(function () {
                cityssm.alertModal("Error", "Error communicating with the server.", "OK", "danger");
            });
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
        htmlModalFolder: "/html/",
        openHtmlModal: function (htmlFileName, callbackFns) {
            window.fetch(cityssm.htmlModalFolder + htmlFileName + ".html")
                .then(function (response) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, response.text()];
                    case 1: return [2, _a.sent()];
                }
            }); }); })
                .then(function (modalHTML) { return __awaiter(void 0, void 0, void 0, function () {
                var modalContainerEle, modalEle, closeModalFunction, closeModalButtonEles, _i, closeModalButtonEles_1, closeModalButtonEle;
                return __generator(this, function (_a) {
                    modalContainerEle = document.createElement("div");
                    modalContainerEle.innerHTML = modalHTML;
                    modalEle = modalContainerEle.querySelector(".modal");
                    document.body.insertAdjacentElement("beforeend", modalContainerEle);
                    if (callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onshow) {
                        callbackFns.onshow(modalEle);
                    }
                    modalEle.classList.add("is-active");
                    closeModalFunction = function () {
                        var modalWasShown = modalEle.classList.contains("is-active");
                        if ((callbackFns === null || callbackFns === void 0 ? void 0 : callbackFns.onhide) && modalWasShown) {
                            var doHide = callbackFns.onhide(modalEle);
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
                        callbackFns.onshown(modalEle, closeModalFunction);
                    }
                    closeModalButtonEles = modalEle.querySelectorAll(".is-close-modal-button");
                    for (_i = 0, closeModalButtonEles_1 = closeModalButtonEles; _i < closeModalButtonEles_1.length; _i++) {
                        closeModalButtonEle = closeModalButtonEles_1[_i];
                        closeModalButtonEle.addEventListener("click", closeModalFunction);
                    }
                    return [2];
                });
            }); })
                .catch(function () {
                cityssm.alertModal("Error", "Error loading popup.", "OK", "danger");
            });
        },
        enableNavBlocker: function () {
            if (!isNavBlockerEnabled) {
                window.addEventListener("beforeunload", navBlockerEventFunction);
                isNavBlockerEnabled = true;
            }
        },
        disableNavBlocker: function () {
            if (isNavBlockerEnabled) {
                window.removeEventListener("beforeunload", navBlockerEventFunction);
                isNavBlockerEnabled = false;
            }
        },
        isNavBlockerEnabled: function () {
            return isNavBlockerEnabled;
        },
        confirmModal: function (titleString, bodyHTML, okButtonHTML, contextualColorName, callbackFunction, cancelCallbackFunction) {
            bulmaJS.confirm({
                title: titleString,
                message: bodyHTML,
                messageIsHtml: true,
                contextualColorName: contextualColorName,
                okButton: {
                    text: okButtonHTML,
                    textIsHtml: true,
                    callbackFunction: callbackFunction
                }
            });
        },
        alertModal: function (titleString, bodyHTML, okButtonHTML, contextualColorName) {
            bulmaJS.alert({
                title: titleString,
                message: bodyHTML,
                messageIsHtml: true,
                contextualColorName: contextualColorName,
                okButton: {
                    text: okButtonHTML,
                    textIsHtml: true
                }
            });
        }
    };
    window.cityssm = window.cityssm || cityssm;
})();
