/* eslint-disable node/no-unsupported-features/es-syntax */

import type { BulmaJS } from "@cityssm/bulma-js/types";
import type { confirmModalFn_modalOptions, cityssmGlobal } from "./types";

declare const bulmaJS: BulmaJS;

(() => {

  // NAV BLOCKER

  let isNavBlockerEnabled = false;

  const navBlockerEventFunction = (event: BeforeUnloadEvent) => {

    const confirmationMessage = "You have unsaved changes that may be lost.";
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  };


  const csrfTokenEle = document.querySelector("meta[name='csrf-token']");
  const csrfToken = (csrfTokenEle ? csrfTokenEle.getAttribute("content") : "");


  const cityssm: cityssmGlobal = {

    // HELPERS

    clearElement: (ele) => {
      while (ele.firstChild) {
        ele.firstChild.remove();
      }
    },

    escapeHTML: (str) => {

      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },

    dateToString: (dateObject) => {

      return dateObject.getFullYear().toString() + "-" +
        ("0" + (dateObject.getMonth() + 1).toString()).slice(-2) + "-" +
        ("0" + (dateObject.getDate().toString())).slice(-2);
    },

    dateToTimeString: (dateObject) => {
      return ("00" + (dateObject.getHours().toString())).slice(-2) +
        ":" +
        ("00" + (dateObject.getMinutes().toString())).slice(-2);
    },

    dateStringToDate: (dateString) => {

      const datePieces = dateString.split("-");

      return new Date(
        Number.parseInt(datePieces[0], 10),
        Number.parseInt(datePieces[1], 10) - 1,
        Number.parseInt(datePieces[2], 10));
    },

    dateStringDifferenceInDays: (fromDateString, toDateString) => {

      const fromDate = cityssm.dateStringToDate(fromDateString);
      const toDate = cityssm.dateStringToDate(toDateString);

      return Math.round((toDate.getTime() - fromDate.getTime()) / (86_400 * 1000));
    },

    // FETCH HELPERS

    responseToJSON: async(response) => {
      return await response.json();
    },

    postJSON: (fetchUrl, formEleOrObj, responseFunction) => {

      const fetchOptions: RequestInit = {
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

          } else {

            const formData = new FormData(formEle);

            const object = {};

            formData.forEach((value, key) => {
              // Reflect.has in favor of: object.hasOwnProperty(key)
              if (!Reflect.has(object, key)) {
                object[key] = value;
                return;
              }
              if (!Array.isArray(object[key])) {
                object[key] = [object[key]];
              }
              object[key].push(value);
            });

            const json = JSON.stringify(object);

            fetchOptions.headers["Content-Type"] = "application/json";
            fetchOptions.body = json;
          }

        } else if (formEleOrObj instanceof Object) {

          fetchOptions.headers["Content-Type"] = "application/json";
          fetchOptions.body = JSON.stringify(formEleOrObj);
        }
      }

      window.fetch(fetchUrl, fetchOptions)
        .then(cityssm.responseToJSON)
        .then(responseFunction)
        .catch(() => {
          cityssm.alertModal("Error", "Error communicating with the server.", "OK", "danger");
        });
    },


    // MODAL TOGGLES


    showModal: (modalEle) => {
      modalEle.classList.add("is-active");
    },

    hideModal: (internalEle_or_internalEvent) => {

      let internalEle = internalEle_or_internalEvent;

      if (internalEle instanceof Event) {
        internalEle = ((internalEle_or_internalEvent as Event).currentTarget as HTMLElement);
      }

      const modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));

      modalEle.classList.remove("is-active");
    },

    htmlModalFolder: "/html/",

    openHtmlModal: (htmlFileName, callbackFns) => {

      // eslint-disable-next-line capitalized-comments
      /*
      * callbackFns
      *
      * - onshow(modalEle)
      *     loaded, part of DOM, not yet visible
      * - onshown(modalEle, closeModalFn)
      *     use closeModalFn() to close the modal properly when not using the close buttons
      * - onhide(modalEle)
      *     return false to cancel hide
      * - onhidden(modalEle)
      *     hidden, but still part of the DOM
      * - onremoved()
      *     no longer part of the DOM
      */

      window.fetch(cityssm.htmlModalFolder + htmlFileName + ".html")
        .then(async(response) => await response.text())
        .then(async(modalHTML) => {

          // Append the modal to the end of the body

          const modalContainerEle = document.createElement("div");
          modalContainerEle.innerHTML = modalHTML;

          const modalEle: HTMLElement = modalContainerEle.querySelector(".modal");

          document.body.insertAdjacentElement("beforeend", modalContainerEle);

          // Call onshow()

          if (callbackFns ?.onshow) {

            callbackFns.onshow(modalEle);

          }

          // Show the modal

          modalEle.classList.add("is-active");

          const closeModalFunction = () => {

            const modalWasShown = modalEle.classList.contains("is-active");

            if (callbackFns ?.onhide && modalWasShown) {

              const doHide = callbackFns.onhide(modalEle);

              if (doHide) {
                return;
              }
            }

            modalEle.classList.remove("is-active");

            if (callbackFns ?.onhidden && modalWasShown) {
              callbackFns.onhidden(modalEle);
            }

            modalContainerEle.remove();

            if (callbackFns ?.onremoved) {
              callbackFns.onremoved();
            }
          };

          // Call onshown()

          if (callbackFns ?.onshown) {
            callbackFns.onshown(modalEle, closeModalFunction);
          }

          // Set up close buttons

          const closeModalButtonEles = modalEle.querySelectorAll(".is-close-modal-button") as NodeListOf<HTMLButtonElement>;

          for (const closeModalButtonEle of closeModalButtonEles) {
            closeModalButtonEle.addEventListener("click", closeModalFunction);
          }
        })
        .catch(() => {
          cityssm.alertModal("Error", "Error loading popup.", "OK", "danger");
        });
    },


    // NAV BLOCKER


    enableNavBlocker: () => {
      if (!isNavBlockerEnabled) {
        window.addEventListener("beforeunload", navBlockerEventFunction);
        isNavBlockerEnabled = true;
      }
    },

    disableNavBlocker: () => {
      if (isNavBlockerEnabled) {
        window.removeEventListener("beforeunload", navBlockerEventFunction);
        isNavBlockerEnabled = false;
      }
    },

    isNavBlockerEnabled: () => {
      return isNavBlockerEnabled;
    },


    // ALERT / CONFIRM MODALS


    confirmModal: (titleString, bodyHTML, okButtonHTML, contextualColorName, callbackFunction, cancelCallbackFunction?) => {

      bulmaJS.confirm({
        title: titleString,
        message: bodyHTML,
        messageIsHtml: true,
        contextualColorName,
        okButton: {
          text: okButtonHTML,
          textIsHtml: true,
          callbackFunction
        }
      });

    },

    alertModal: (titleString, bodyHTML, okButtonHTML, contextualColorName) => {

      bulmaJS.alert({
        title: titleString,
        message: bodyHTML,
        messageIsHtml: true,
        contextualColorName,
        okButton: {
          text: okButtonHTML,
          textIsHtml: true
        }
      });
    }
  };

  (window as any).cityssm = (window as any).cityssm || cityssm;
})();
