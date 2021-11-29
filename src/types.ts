/* eslint-disable node/no-unsupported-features/es-syntax */

type BulmaContextualColors = "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger";

type ParsedJSON = Record<string, unknown> | boolean | number | string;


export interface confirmModalFn_modalOptions {

  contextualColorName: BulmaContextualColors;
  titleString: string;
  bodyHTML: string;

  hideCancelButton?: boolean;
  cancelButtonHTML?: string;
  cancelCallbackFn?: () => void;

  okButtonHTML: string;
  callbackFn?: () => void;
}


export interface cityssmGlobal {

  clearElement: (element: HTMLElement) => void;
  escapeHTML: (unescapedString: string) => string;

  postJSON:
  (fetchUrl: string, formEleOrObject: unknown | HTMLFormElement, responseFunction: (responseJSON: ParsedJSON) => void) => void;

  responseToJSON: (response: Response) => Promise<ParsedJSON>;

  showModal: (modalEle: HTMLElement) => void;
  hideModal: (internalElementOrEvent: HTMLElement | Event) => void;

  htmlModalFolder: string;

  openHtmlModal: (htmlFileName: string, callbackFns: {
    onshow?: (modalEle: HTMLElement) => void;
    onshown?: (modalEle: HTMLElement, closeModalFunction: () => void) => void;
    onhide?: (modalEle: HTMLElement) => boolean;
    onhidden?: (modalEle: HTMLElement) => void;
    onremoved?: () => void;
  }) => void;

  confirmModal: (titleString: string,
    bodyHTML: string,
    okButtonHTML: string,
    contextualColorName: BulmaContextualColors,
    okButtonCallbackFunction: () => void,
    cancelButtonCallbackFunction?: () => void) => void;

  alertModal: (titleString: string,
    bodyHTML: string,
    okButtonHTML: string,
    contextualColorName: BulmaContextualColors) => void;

  dateToString: (dateObject: Date) => string;
  dateToTimeString: (dateObject: Date) => string;
  dateStringToDate: (dateString: string) => Date;
  dateStringDifferenceInDays: (toDateString: string, fromDateString: string) => number;

  enableNavBlocker: () => void;
  disableNavBlocker: () => void;
  isNavBlockerEnabled: () => boolean;
}
