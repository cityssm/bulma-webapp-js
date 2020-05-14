export declare type cityssmGlobal = {
    clearElement: (element: HTMLElement) => void;
    escapeHTML: (unescapedString: string) => string;
    postJSON: (fetchUrl: string, formEleOrObject: {} | HTMLFormElement, responseFn: () => void) => void;
    responseToJSON: (response: Response) => Promise<any>;
    showModal: (modalEle: HTMLElement) => void;
    hideModal: (internalElementOrEvent: HTMLElement | Event) => void;
    openHtmlModal: (htmlFileName: string, callbackFns: {
        onshow?: (modalEle: Element) => void;
        onshown?: (modalEle: Element, closeModalFn: () => void) => void;
        onhide?: (modalEle: Element) => boolean;
        onhidden?: (modalEle: Element) => void;
        onremoved?: () => void;
    }) => void;
    confirmModal: (titleString: string, bodyHTML: string, okButtonHTML: string, contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger", okButtonCallbackFn: () => void) => void;
    alertModal: (titleString: string, bodyHTML: string, okButtonHTML: string, contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger") => void;
    dateToString: (dateObject: Date) => string;
    dateStringToDate: (dateString: string) => Date;
    dateStringDifferenceInDays: (toDateString: string, fromDateString: string) => number;
    enableNavBlocker: () => void;
    disableNavBlocker: () => void;
};
