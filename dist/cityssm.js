"use strict";

(() => {
    let isNavBlockerEnabled = false;
    const navBlockerEventFunction = (event) => {
        const confirmationMessage = 'You have unsaved changes that may be lost.';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    };
    const csrfTokenEle = document.querySelector("meta[name='csrf-token']");
    const csrfToken = csrfTokenEle ? csrfTokenEle.getAttribute('content') : '';
    const cityssm = {
        clearElement: (ele) => {
            while (ele.firstChild) {
                ele.firstChild.remove();
            }
        },
        escapeHTML: (str) => {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        },
        dateToString: (dateObject) => {
            return (dateObject.getFullYear().toString() +
                '-' +
                ('0' + (dateObject.getMonth() + 1).toString()).slice(-2) +
                '-' +
                ('0' + dateObject.getDate().toString()).slice(-2));
        },
        dateToTimeString: (dateObject) => {
            return (('00' + dateObject.getHours().toString()).slice(-2) +
                ':' +
                ('00' + dateObject.getMinutes().toString()).slice(-2));
        },
        dateStringToDate: (dateString) => {
            const datePieces = dateString.split('-');
            return new Date(Number.parseInt(datePieces[0], 10), Number.parseInt(datePieces[1], 10) - 1, Number.parseInt(datePieces[2], 10));
        },
        dateStringDifferenceInDays: (fromDateString, toDateString) => {
            const fromDate = cityssm.dateStringToDate(fromDateString);
            const toDate = cityssm.dateStringToDate(toDateString);
            return Math.round((toDate.getTime() - fromDate.getTime()) / (86_400 * 1000));
        },
        responseToJSON: async (response) => {
            return await response.json();
        },
        postJSON: (fetchUrl, formEleOrObj, responseFunction) => {
            const fetchOptions = {
                credentials: 'same-origin',
                headers: {
                    'x-csrf-token': csrfToken
                },
                method: 'POST'
            };
            if (formEleOrObj) {
                if (formEleOrObj instanceof HTMLFormElement) {
                    const formEle = formEleOrObj;
                    if (formEle.querySelector("input[name][type='file']")) {
                        fetchOptions.body = new FormData(formEle);
                    }
                    else {
                        const formData = new FormData(formEle);
                        const object = {};
                        formData.forEach((value, key) => {
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
                        fetchOptions.headers['Content-Type'] = 'application/json';
                        fetchOptions.body = json;
                    }
                }
                else if (formEleOrObj instanceof Object) {
                    fetchOptions.headers['Content-Type'] = 'application/json';
                    fetchOptions.body = JSON.stringify(formEleOrObj);
                }
            }
            window
                .fetch(fetchUrl, fetchOptions)
                .then(cityssm.responseToJSON)
                .then(responseFunction)
                .catch((error) => {
                console.error(error);
            });
        },
        showModal: (modalEle) => {
            modalEle.classList.add('is-active');
        },
        hideModal: (internalEle_or_internalEvent) => {
            let internalEle = internalEle_or_internalEvent;
            if (internalEle instanceof Event) {
                internalEle = internalEle_or_internalEvent
                    .currentTarget;
            }
            const modalEle = internalEle.classList.contains('modal')
                ? internalEle
                : internalEle.closest('.modal');
            modalEle.classList.remove('is-active');
        },
        htmlModalFolder: '/html/',
        openHtmlModal: (htmlFileName, callbackFns) => {
            window
                .fetch(cityssm.htmlModalFolder + htmlFileName + '.html')
                .then(async (response) => await response.text())
                .then(async (modalHTML) => {
                const modalContainerEle = document.createElement('div');
                modalContainerEle.innerHTML = modalHTML;
                const modalEle = modalContainerEle.querySelector('.modal');
                document.body.insertAdjacentElement('beforeend', modalContainerEle);
                if (callbackFns?.onshow) {
                    callbackFns.onshow(modalEle);
                }
                modalEle.classList.add('is-active');
                const closeModalFunction = () => {
                    const modalWasShown = modalEle.classList.contains('is-active');
                    if (callbackFns?.onhide && modalWasShown) {
                        const doHide = callbackFns.onhide(modalEle);
                        if (doHide) {
                            return;
                        }
                    }
                    modalEle.classList.remove('is-active');
                    if (callbackFns?.onhidden && modalWasShown) {
                        callbackFns.onhidden(modalEle);
                    }
                    modalContainerEle.remove();
                    if (callbackFns?.onremoved) {
                        callbackFns.onremoved();
                    }
                };
                if (callbackFns?.onshown) {
                    callbackFns.onshown(modalEle, closeModalFunction);
                }
                const closeModalButtonEles = modalEle.querySelectorAll('.is-close-modal-button');
                for (const closeModalButtonEle of closeModalButtonEles) {
                    closeModalButtonEle.addEventListener('click', closeModalFunction);
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
        isNavBlockerEnabled: () => {
            return isNavBlockerEnabled;
        }
    };
    window.cityssm = window.cityssm || cityssm;
})();
