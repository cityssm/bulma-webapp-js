type ParsedJSON = Record<string, unknown> | boolean | number | string;
export interface cityssmGlobal {
    clearElement: (element: HTMLElement) => void;
    escapeHTML: (unescapedString: string) => string;
    postJSON: (fetchUrl: string, formEleOrObject: unknown | HTMLFormElement, responseFunction: (responseJSON: ParsedJSON) => void) => void;
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
    dateToString: (dateObject: Date) => string;
    dateToTimeString: (dateObject: Date) => string;
    dateStringToDate: (dateString: string) => Date;
    dateStringDifferenceInDays: (toDateString: string, fromDateString: string) => number;
    enableNavBlocker: () => void;
    disableNavBlocker: () => void;
    isNavBlockerEnabled: () => boolean;
}
export {};
