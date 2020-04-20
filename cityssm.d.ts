declare type confirmModalFn_modalOptions = {
    contextualColorName: "dark" | "primary" | "link" | "info" | "success" | "warning" | "danger";
    titleString: string;
    bodyHTML: string;
    hideCancelButton?: boolean;
    cancelButtonHTML?: string;
    okButtonHTML: string;
    callbackFn?: Function;
};
