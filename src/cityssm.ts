import { cityssmGlobal } from "./types";

type confirmModalFn_modalOptions = {

  contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger",
  titleString: string,
  bodyHTML: string,

  hideCancelButton?: boolean,
  cancelButtonHTML?: string,

  okButtonHTML: string,
  callbackFn?: () => any
};


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

    (<HTMLElement>okButtonEle).focus();
  };


  const cityssm: cityssmGlobal = {

    // HELPERS

    clearElement(ele: HTMLElement) {
      while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
      }
    },

    escapeHTML(str: string) {

      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },

    dateToString(dateObj: Date) {

      return dateObj.getFullYear() + "-" +
        ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" +
        ("0" + (dateObj.getDate())).slice(-2);
    },

    dateStringToDate(dateString: string) {

      const datePieces = dateString.split("-");
      return new Date(parseInt(datePieces[0], 10), parseInt(datePieces[1], 10) - 1, parseInt(datePieces[2], 10), 0, 0, 0, 0);
    },

    dateStringDifferenceInDays(fromDateString: string, toDateString: string) {

      const fromDate = cityssm.dateStringToDate(fromDateString);
      const toDate = cityssm.dateStringToDate(toDateString);

      return Math.round((toDate.getTime() - fromDate.getTime()) / (86400 * 1000.0));
    },

    // FETCH HELPERS

    responseToJSON(response: Response) {
      return response.json();
    },

    postJSON(fetchUrl: string, formEleOrObj: HTMLFormElement | object, responseFn: (responseJSON: {}) => void) {

      const fetchOptions: RequestInit = {
        method: "POST",
        credentials: "include"
      };


      if (formEleOrObj) {

        if (formEleOrObj instanceof HTMLFormElement) {

          const formEle = formEleOrObj as HTMLFormElement;

          if (formEle.querySelector("input[name][type='file']")) {

            fetchOptions.body = new FormData(formEle);

          } else {
            fetchOptions.body = new URLSearchParams(new FormData(formEle));
          }


        } else if (formEleOrObj instanceof Object) {

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


    // MODAL TOGGLES


    showModal(modalEle: HTMLElement) {
      modalEle.classList.add("is-active");
    },

    hideModal(internalEle_or_internalEvent: HTMLElement | Event) {

      let internalEle = internalEle_or_internalEvent;

      if (internalEle instanceof Event) {
        internalEle = ((internalEle_or_internalEvent as Event).currentTarget as HTMLElement);
      }

      const modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));

      modalEle.classList.remove("is-active");
    },

    openHtmlModal(
      htmlFileName: string,
      callbackFns: {
        onshow?: (modalEle: HTMLElement) => void,
        onshown?: (modalEle: HTMLElement, closeModalFn: () => void) => void,
        onhide?: (modalEle: HTMLElement) => boolean
        onhidden?: (modalEle: HTMLElement) => void,
        onremoved?: () => void,

      }) {

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

      window.fetch("/html/" + htmlFileName + ".html")
        .then((response) => response.text())
        .then((modalHTML) => {

          // Append the modal to the end of the body

          const modalContainerEle = document.createElement("div");
          modalContainerEle.innerHTML = modalHTML;

          const modalEle = <HTMLElement>modalContainerEle.getElementsByClassName("modal")[0];

          document.body.insertAdjacentElement("beforeend", modalContainerEle);

          // Call onshow()

          if (callbackFns && callbackFns.onshow) {

            callbackFns.onshow(modalEle);

          }

          // Show the modal

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

          // Call onshown()

          if (callbackFns && callbackFns.onshown) {
            callbackFns.onshown(modalEle, closeModalFn);
          }

          // Set up close buttons

          const closeModalBtnEles = modalEle.getElementsByClassName("is-close-modal-button");

          for (const closeModalBtnEle of closeModalBtnEles) {
            closeModalBtnEle.addEventListener("click", closeModalFn);
          }
        });
    },


    // NAV BLOCKER


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


    // ALERT / CONFIRM MODALS


    confirmModal(
      titleString: string,
      bodyHTML: string,
      okButtonHTML: string,
      contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger",
      callbackFn: () => void) {

      confirmModalFn({
        contextualColorName: contextualColorName,
        titleString: titleString,
        bodyHTML: bodyHTML,
        okButtonHTML: okButtonHTML,
        callbackFn: callbackFn
      });
    },

    alertModal(
      titleString: string,
      bodyHTML: string,
      okButtonHTML: string,
      contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger") {

      confirmModalFn({
        contextualColorName: contextualColorName,
        titleString: titleString,
        bodyHTML: bodyHTML,
        hideCancelButton: true,
        okButtonHTML: okButtonHTML
      });
    }
  };

  (<any>window).cityssm = (<any>window).cityssm || cityssm;
})();
