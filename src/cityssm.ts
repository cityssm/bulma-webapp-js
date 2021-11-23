import type { confirmModalFn_modalOptions, cityssmGlobal } from "./types";


(() => {

  // NAV BLOCKER

  let isNavBlockerEnabled = false;

  const navBlockerEventFn = (e: BeforeUnloadEvent) => {

    const confirmationMessage = "You have unsaved changes that may be lost.";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  // ALERT / CONFIRM MODALS

  const confirmModalFn = (modalOptions: confirmModalFn_modalOptions) => {

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

    (okButtonEle as HTMLElement).focus();
  };


  const csrfTokenEle = document.querySelector("meta[name='csrf-token']");
  const csrfToken = (csrfTokenEle ? csrfTokenEle.getAttribute("content") : "");


  const cityssm: cityssmGlobal = {

    // HELPERS

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

    dateToTimeString: (dateObj) => {
      return ("00" + (dateObj.getHours().toString())).slice(-2) +
        ":" +
        ("00" + (dateObj.getMinutes().toString())).slice(-2);
    },

    dateStringToDate: (dateString) => {

      const datePieces = dateString.split("-");

      return new Date(
        parseInt(datePieces[0], 10),
        parseInt(datePieces[1], 10) - 1,
        parseInt(datePieces[2], 10));
    },

    dateStringDifferenceInDays: (fromDateString, toDateString) => {

      const fromDate = cityssm.dateStringToDate(fromDateString);
      const toDate = cityssm.dateStringToDate(toDateString);

      return Math.round((toDate.getTime() - fromDate.getTime()) / (86400 * 1000.0));
    },

    // FETCH HELPERS

    responseToJSON: async (response) => {
      return await response.json();
    },

    postJSON: (fetchUrl, formEleOrObj, responseFn) => {

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

      console.log(fetchOptions.body);

      window.fetch(fetchUrl, fetchOptions)
        .then(cityssm.responseToJSON)
        .then(responseFn)
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
        .then(async (response) => await response.text())
        .then(async (modalHTML) => {

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

          const closeModalFn = () => {

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
            callbackFns.onshown(modalEle, closeModalFn);
          }

          // Set up close buttons

          const closeModalBtnEles = modalEle.getElementsByClassName("is-close-modal-button");

          for (let index = 0; index < closeModalBtnEles.length; index += 1) {
            closeModalBtnEles[index].addEventListener("click", closeModalFn);
          }
        })
        .catch(() => {
          cityssm.alertModal("Error", "Error loading popup.", "OK", "danger");
        });
    },


    // NAV BLOCKER


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


    // ALERT / CONFIRM MODALS


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

  (window as any).cityssm = (window as any).cityssm || cityssm;
})();
