/* eslint-disable unicorn/filename-case */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'

import type { CityssmGlobal } from './types.js'

declare const bulmaJS: BulmaJS
declare const cityssm: CityssmGlobal

/*
 * LOGOUT MODAL
 */

document
  .querySelector('#cityssm-theme--logout-button')
  ?.addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault()

    bulmaJS.confirm({
      contextualColorName: 'warning',
      title: 'Log Out?',

      message: 'Are you sure you want to log out?',
      okButton: {
        text: 'Log Out',

        callbackFunction: () => {
          const urlPrefix =
            document.querySelector('main')?.dataset.urlPrefix ?? ''

          globalThis.localStorage.clear()
          globalThis.location.href = `${urlPrefix}/logout`
        }
      }
    })
  })

/*
 * SIDE MENU INIT
 */
;(() => {
  const localStoragePropertyName = 'collapseSidemenu'

  const collapseButtonElement = document.querySelector<HTMLButtonElement>(
    '#cityssm-theme--sidemenu-collapse-button'
  )

  const collapseSidemenuElement = document.querySelector(
    '#cityssm-theme--sidemenu-collapsed'
  )

  const expandButtonElement = document.querySelector<HTMLButtonElement>(
    '#cityssm-theme--sidemenu-expand-button'
  )

  const expandSidemenuElement = document.querySelector(
    '#cityssm-theme--sidemenu-expanded'
  )

  const collapseFunction = (clickEvent?: Event): void => {
    expandSidemenuElement?.classList.add('is-hidden')
    collapseSidemenuElement?.classList.remove('is-hidden')

    try {
      globalThis.localStorage.setItem(localStoragePropertyName, 'true')
    } catch {
      // ignore
    }

    if (clickEvent) {
      expandButtonElement?.focus()
    }
  }

  const expandFunction = (): void => {
    collapseSidemenuElement?.classList.add('is-hidden')
    expandSidemenuElement?.classList.remove('is-hidden')

    try {
      globalThis.localStorage.removeItem(localStoragePropertyName)
    } catch {
      // Ignore
    }

    collapseButtonElement?.focus()
  }

  if (
    collapseButtonElement !== null &&
    collapseSidemenuElement !== null &&
    expandButtonElement !== null &&
    expandSidemenuElement !== null
  ) {
    collapseButtonElement.addEventListener('click', collapseFunction)
    expandButtonElement.addEventListener('click', expandFunction)

    try {
      if (globalThis.localStorage.getItem(localStoragePropertyName)) {
        collapseFunction()
      }
    } catch {
      // Ignore
    }
  }
})()

/*
 * KEEP ALIVE
 */
;(() => {
  const keepAliveMillis =
    document.querySelector('main')?.dataset.sessionKeepAliveMillis

  if (keepAliveMillis !== undefined && keepAliveMillis !== '0') {
    const urlPrefix = document.querySelector('main')?.dataset.urlPrefix ?? ''

    const keepAliveFunction = (): void => {
      cityssm.postJSON(
        `${urlPrefix}/keepAlive`,
        {
          t: Date.now()
        },
        () => {
          /* empty */
        }
      )
    }

    globalThis.setInterval(
      keepAliveFunction,
      Number.parseInt(keepAliveMillis, 10)
    )
  }
})()
