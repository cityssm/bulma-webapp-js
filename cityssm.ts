(function() {

  const cityssm: any = {};


  // HELPERS


  cityssm.clearElement = function(ele: HTMLElement) {
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  };

  cityssm.escapeHTML = function(str: string) {

    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  };

  cityssm.dateToString = function(dateObj: Date) {

    return dateObj.getFullYear() + "-" +
      ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" +
      ("0" + (dateObj.getDate())).slice(-2);

  };


  // FETCH HELPERS


  cityssm.responseToJSON = function(response: Response) {
    return response.json();
  };

  cityssm.postJSON = function(fetchUrl: string, formEleOrObj, responseFn) {

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include"
    };


    if (formEleOrObj) {

      if (formEleOrObj.tagName && formEleOrObj.tagName === "FORM") {

        if (formEleOrObj.querySelector("input[name][type='file']")) {

          fetchOptions.body = new FormData(formEleOrObj);

        } else {

          fetchOptions.body = new URLSearchParams(new FormData(formEleOrObj));

        }


      } else if (formEleOrObj.constructor === Object) {

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


  // MODAL TOGGLES

  cityssm.showModal = function(modalEle: HTMLElement) {

    modalEle.classList.add("is-active");

  };

  cityssm.hideModal = function(internalEle_or_internalEvent) {

    const internalEle = internalEle_or_internalEvent.currentTarget || internalEle_or_internalEvent;

    const modalEle = (internalEle.classList.contains("modal") ? internalEle : internalEle.closest(".modal"));

    modalEle.classList.remove("is-active");

  };

  cityssm.openHtmlModal = function(htmlFileName: string, callbackFns) {

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
      .then(function(response) {

        return response.text();

      })
      .then(function(modalHTML) {

        // Append the modal to the end of the body

        const modalContainerEle = document.createElement("div");
        modalContainerEle.innerHTML = modalHTML;

        const modalEle = modalContainerEle.getElementsByClassName("modal")[0];

        document.body.insertAdjacentElement("beforeend", modalContainerEle);

        // Call onshow()

        if (callbackFns && callbackFns.onshow) {

          callbackFns.onshow(modalEle);

        }

        // Show the modal

        modalEle.classList.add("is-active");

        const closeModalFn = function() {

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

        for (let btnIndex = 0; btnIndex < closeModalBtnEles.length; btnIndex += 1) {

          closeModalBtnEles[btnIndex].addEventListener("click", closeModalFn);

        }

      });

  };


  // NAV BLOCKER


  let isNavBlockerEnabled = false;

  function navBlockerEventFn(e: BeforeUnloadEvent) {

    const confirmationMessage = "You have unsaved changes that may be lost.";
    e.returnValue = confirmationMessage;
    return confirmationMessage;

  }

  cityssm.enableNavBlocker = function() {

    if (!isNavBlockerEnabled) {

      window.addEventListener("beforeunload", navBlockerEventFn);
      isNavBlockerEnabled = true;

    }

  };

  cityssm.disableNavBlocker = function() {

    if (isNavBlockerEnabled) {

      window.removeEventListener("beforeunload", navBlockerEventFn);
      isNavBlockerEnabled = false;

    }

  };


  (<any>window).cityssm = cityssm;

}());
