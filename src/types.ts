type BulmaContextualColors = "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger";

type ParsedJSON = {} | boolean | number | string;


export interface confirmModalFn_modalOptions {

  contextualColorName: BulmaContextualColors;
  titleString: string;
  bodyHTML: string;

  hideCancelButton?: boolean;
  cancelButtonHTML?: string;

  okButtonHTML: string;
  callbackFn?: () => void;
}


export interface cityssmGlobal {

  clearElement: (element: HTMLElement) => void;
  escapeHTML: (unescapedString: string) => string;

  postJSON: (fetchUrl: string, formEleOrObject: {} | HTMLFormElement, responseFn: (responseJSON: ParsedJSON) => void) => void;
  responseToJSON: (response: Response) => Promise<ParsedJSON>;

  showModal: (modalEle: HTMLElement) => void;
  hideModal: (internalElementOrEvent: HTMLElement | Event) => void;

  htmlModalFolder: string;

  openHtmlModal: (htmlFileName: string, callbackFns: {
    onshow?: (modalEle: HTMLElement) => void;
    onshown?: (modalEle: HTMLElement, closeModalFn: () => void) => void;
    onhide?: (modalEle: HTMLElement) => boolean;
    onhidden?: (modalEle: HTMLElement) => void;
    onremoved?: () => void;
  }) => void;

  confirmModal: (titleString: string,
    bodyHTML: string,
    okButtonHTML: string,
    contextualColorName: BulmaContextualColors,
    okButtonCallbackFn: () => void) => void;

  alertModal: (titleString: string,
    bodyHTML: string,
    okButtonHTML: string,
    contextualColorName: BulmaContextualColors) => void;

  dateToString: (dateObject: Date) => string;
  dateStringToDate: (dateString: string) => Date;
  dateStringDifferenceInDays: (toDateString: string, fromDateString: string) => number;

  enableNavBlocker: () => void;
  disableNavBlocker: () => void;
  isNavBlockerEnabled: () => boolean;
}
