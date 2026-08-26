(() => {
    let isNavBlockerEnabled = false;
    const navBlockerEventFunction = (event) => {
        const confirmationMessage = 'You have unsaved changes that may be lost.';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    };
    const csrfTokenElement = document.querySelector("meta[name='csrf-token']");
    const csrfToken = csrfTokenElement === null
        ? ''
        : (csrfTokenElement.getAttribute('content') ?? '');
    const cityssm = {
        escapeHTML: (stringValue) => stringValue
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;'),
        dateToString: (dateObject) => `${dateObject.getFullYear().toString()}-${(dateObject.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`,
        dateToTimeString: (dateObject) => `${dateObject.getHours().toString().padStart(2, '0')}:${dateObject
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
        dateStringToDate: (dateString) => {
            const datePieces = dateString.split('-');
            return new Date(Number.parseInt(datePieces[0], 10), Number.parseInt(datePieces[1], 10) - 1, Number.parseInt(datePieces[2], 10));
        },
        dateStringDifferenceInDays: (fromDateString, toDateString) => {
            const fromDate = cityssm.dateStringToDate(fromDateString);
            const toDate = cityssm.dateStringToDate(toDateString);
            return Math.round((toDate.getTime() - fromDate.getTime()) / (86_400 * 1000));
        },
        responseToJSON: async (response) => (await response.json()),
        postJSON: (fetchUrl, formElementOrObject, responseFunction) => {
            const fetchOptions = {
                credentials: 'same-origin',
                headers: {
                    'x-csrf-token': csrfToken
                },
                method: 'POST'
            };
            if (formElementOrObject instanceof HTMLFormElement) {
                const formElement = formElementOrObject;
                if (formElement.querySelector("input[name][type='file']") === null) {
                    const formData = new FormData(formElement);
                    const object = {};
                    for (const [key, value] of formData.entries()) {
                        if (!Reflect.has(object, key)) {
                            object[key] = value;
                            continue;
                        }
                        if (!Array.isArray(object[key])) {
                            object[key] = [object[key]];
                        }
                        object[key].push(value);
                    }
                    const json = JSON.stringify(object);
                    fetchOptions.headers['Content-Type'] = 'application/json';
                    fetchOptions.body = json;
                }
                else {
                    fetchOptions.body = new FormData(formElement);
                }
            }
            else if (formElementOrObject instanceof Object) {
                fetchOptions.headers['Content-Type'] = 'application/json';
                fetchOptions.body = JSON.stringify(formElementOrObject);
            }
            globalThis
                .fetch(fetchUrl, fetchOptions)
                .then(async (response) => await cityssm.responseToJSON(response))
                .then(responseFunction)
                .catch((error) => {
                console.error(error);
            });
        },
        showModal: (modalElement) => {
            modalElement.classList.add('is-active');
        },
        hideModal: (internalElementOrEvent) => {
            let internalElement = internalElementOrEvent;
            if (internalElement instanceof Event) {
                internalElement = internalElementOrEvent
                    .currentTarget;
            }
            const modalElement = internalElement.classList.contains('modal')
                ? internalElement
                : internalElement.closest('.modal');
            modalElement?.classList.remove('is-active');
        },
        htmlModalFolder: '/html/',
        openHtmlModal: (htmlFileName, callbackFunctions) => {
            globalThis
                .fetch(`${cityssm.htmlModalFolder + htmlFileName}.html`)
                .then(async (response) => await response.text())
                .then((modalHTML) => {
                const modalContainerElement = document.createElement('div');
                modalContainerElement.innerHTML = modalHTML;
                const modalElement = modalContainerElement.querySelector('.modal');
                if (modalElement === null) {
                    throw new Error(`No modal element found in HTML file: ${htmlFileName}`);
                }
                document.body.insertAdjacentElement('beforeend', modalContainerElement);
                callbackFunctions.onshow?.(modalElement);
                modalElement.classList.add('is-active');
                const closeModalFunction = () => {
                    const modalWasShown = modalElement.classList.contains('is-active');
                    if (callbackFunctions.onhide !== undefined && modalWasShown) {
                        const doHide = callbackFunctions.onhide(modalElement);
                        if (doHide) {
                            return;
                        }
                    }
                    modalElement.classList.remove('is-active');
                    callbackFunctions.onhidden?.(modalElement);
                    modalContainerElement.remove();
                    callbackFunctions.onremoved?.();
                };
                callbackFunctions.onshown?.(modalElement, closeModalFunction);
                const closeModalButtonElements = modalElement.querySelectorAll('.is-close-modal-button');
                for (const closeModalButtonElement of closeModalButtonElements) {
                    closeModalButtonElement.addEventListener('click', closeModalFunction);
                }
            })
                .catch((error) => {
                console.error(error);
            });
        },
        enableNavBlocker: () => {
            if (!isNavBlockerEnabled) {
                window.addEventListener('beforeunload', navBlockerEventFunction);
                isNavBlockerEnabled = true;
            }
        },
        disableNavBlocker: () => {
            if (isNavBlockerEnabled) {
                window.removeEventListener('beforeunload', navBlockerEventFunction);
                isNavBlockerEnabled = false;
            }
        },
        isNavBlockerEnabled: () => isNavBlockerEnabled
    };
    globalThis.cityssm = globalThis.cityssm ?? cityssm;
})();
