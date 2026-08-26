export interface CityssmGlobal {
  escapeHTML: (unescapedString: string) => string

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  postJSON: <T>(
    fetchUrl: string,
    formElementOrObject: HTMLFormElement | Record<string, unknown>,
    responseFunction: (responseJSON: T) => void
  ) => void

  responseToJSON: <T>(response: Response) => Promise<T>

  hideModal: (internalElementOrEvent: Event | HTMLElement) => void
  showModal: (modalElement: HTMLElement) => void

  htmlModalFolder: string

  openHtmlModal: (
    htmlFileName: string,
    callbackFunctions: {
      onshow?: (modalElement: HTMLElement) => void

      onshown?: (
        modalElement: HTMLElement,
        closeModalFunction: () => void
      ) => void

      onhide?: (modalElement: HTMLElement) => boolean

      onhidden?: (modalElement: HTMLElement) => void

      onremoved?: () => void
    }
  ) => void

  dateToString: (dateObject: Date) => string
  dateToTimeString: (dateObject: Date) => string

  dateStringToDate: (dateString: string) => Date

  dateStringDifferenceInDays: (
    toDateString: string,
    fromDateString: string
  ) => number

  disableNavBlocker: () => void
  enableNavBlocker: () => void
  isNavBlockerEnabled: () => boolean
}
