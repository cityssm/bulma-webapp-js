declare const cityssm: {
    confirmModal: (titleString: string, bodyHTML: string, okButtonHTML: string, contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger", callbackFn: () => void) => void;
    postJSON: (fetchUrl: string, formObj: object, responseFn: () => void) => void;
};
