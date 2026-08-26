import type { BulmaJS } from '@cityssm/bulma-js/types.js'

import type { CityssmGlobal } from './types.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const bulmaJS: BulmaJS
;(() => {
  // NAV BLOCKER

  let isNavBlockerEnabled = false

  const navBlockerEventFunction = (event: BeforeUnloadEvent): string => {
    const confirmationMessage = 'You have unsaved changes that may be lost.'

    // eslint-disable-next-line sonarjs/deprecation, @typescript-eslint/no-deprecated
    event.returnValue = confirmationMessage

    return confirmationMessage
  }

  const csrfTokenElement = document.querySelector("meta[name='csrf-token']")

  const csrfToken =
    csrfTokenElement === null
      ? ''
      : (csrfTokenElement.getAttribute('content') ?? '')

  const cityssm: CityssmGlobal = {
    // HELPERS

    escapeHTML: (stringValue) =>
      stringValue
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;'),

    dateToString: (dateObject) =>
      `${dateObject.getFullYear().toString()}-${(dateObject.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`,

    dateToTimeString: (dateObject) =>
      `${dateObject.getHours().toString().padStart(2, '0')}:${dateObject
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,

    dateStringToDate: (dateString) => {
      const datePieces = dateString.split('-')

      return new Date(
        Number.parseInt(datePieces[0], 10),
        Number.parseInt(datePieces[1], 10) - 1,
        Number.parseInt(datePieces[2], 10)
      )
    },

    dateStringDifferenceInDays: (fromDateString, toDateString) => {
      const fromDate = cityssm.dateStringToDate(fromDateString)
      const toDate = cityssm.dateStringToDate(toDateString)

      return Math.round(
        (toDate.getTime() - fromDate.getTime()) / (86_400 * 1000)
      )
    },

    // FETCH HELPERS

    responseToJSON: async <T>(
      response: Response
    ): Promise<T> => (await response.json()) as unknown as T,

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    postJSON: <T>(
      fetchUrl: string,
      formElementOrObject: HTMLFormElement | Record<string, unknown>,
      responseFunction: (responseJSON: T) => void
    ) => {
      const fetchOptions: RequestInit & {
        headers: Record<string, string>
      } = {
        credentials: 'same-origin',
        headers: {
          'x-csrf-token': csrfToken
        },
        method: 'POST'
      }

      if (formElementOrObject instanceof HTMLFormElement) {
        const formElement = formElementOrObject

        if (formElement.querySelector("input[name][type='file']") === null) {
          const formData = new FormData(formElement)

          const object = {}

          for (const [key, value] of formData.entries()) {
            // Reflect.has in favor of: object.hasOwnProperty(key)
            if (!Reflect.has(object, key)) {
              object[key] = value
              continue
            }

            if (!Array.isArray(object[key])) {
              object[key] = [object[key]]
            }

            object[key].push(value)
          }

          const json = JSON.stringify(object)

          fetchOptions.headers['Content-Type'] = 'application/json'
          fetchOptions.body = json
        } else {
          fetchOptions.body = new FormData(formElement)
        }
      } else if (formElementOrObject instanceof Object) {
        fetchOptions.headers['Content-Type'] = 'application/json'
        fetchOptions.body = JSON.stringify(formElementOrObject)
      }

      globalThis
        .fetch(fetchUrl, fetchOptions)
        .then(async (response) => await cityssm.responseToJSON<T>(response))
        .then(responseFunction)
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },

    // MODAL TOGGLES

    showModal: (modalElement) => {
      modalElement.classList.add('is-active')
    },

    hideModal: (internalElementOrEvent) => {
      let internalElement = internalElementOrEvent

      if (internalElement instanceof Event) {
        internalElement = (internalElementOrEvent as Event)
          .currentTarget as HTMLElement
      }

      const modalElement = internalElement.classList.contains('modal')
        ? internalElement
        : internalElement.closest('.modal')

      modalElement?.classList.remove('is-active')
    },

    htmlModalFolder: '/html/',

    openHtmlModal: (htmlFileName, callbackFunctions) => {
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

      globalThis
        .fetch(`${cityssm.htmlModalFolder + htmlFileName}.html`)
        .then(async (response) => await response.text())
        .then((modalHTML) => {
          // Append the modal to the end of the body

          const modalContainerElement = document.createElement('div')

          // eslint-disable-next-line browser-security/no-innerhtml
          modalContainerElement.innerHTML = modalHTML

          const modalElement =
            modalContainerElement.querySelector<HTMLElement>('.modal')

          if (modalElement === null) {
            throw new Error(
              `No modal element found in HTML file: ${htmlFileName}`
            )
          }

          document.body.insertAdjacentElement(
            'beforeend',
            modalContainerElement
          )

          // Call onshow()

          callbackFunctions.onshow?.(modalElement)

          // Show the modal

          modalElement.classList.add('is-active')

          const closeModalFunction = (): void => {
            const modalWasShown = modalElement.classList.contains('is-active')

            if (callbackFunctions.onhide !== undefined && modalWasShown) {
              const doHide = callbackFunctions.onhide(modalElement)

              if (doHide) {
                return
              }
            }

            modalElement.classList.remove('is-active')

            callbackFunctions.onhidden?.(modalElement)

            modalContainerElement.remove()

            callbackFunctions.onremoved?.()
          }

          // Call onshown()

          callbackFunctions.onshown?.(modalElement, closeModalFunction)

          // Set up close buttons

          const closeModalButtonElements = modalElement.querySelectorAll(
            '.is-close-modal-button'
          ) as NodeListOf<HTMLButtonElement>

          for (const closeModalButtonElement of closeModalButtonElements) {
            closeModalButtonElement.addEventListener(
              'click',
              closeModalFunction
            )
          }
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },

    // NAV BLOCKER

    enableNavBlocker: () => {
      if (!isNavBlockerEnabled) {
        window.addEventListener('beforeunload', navBlockerEventFunction)
        isNavBlockerEnabled = true
      }
    },

    disableNavBlocker: () => {
      if (isNavBlockerEnabled) {
        window.removeEventListener('beforeunload', navBlockerEventFunction)
        isNavBlockerEnabled = false
      }
    },

    isNavBlockerEnabled: () => isNavBlockerEnabled
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).cityssm = (globalThis as any).cityssm ?? cityssm
})()
