document
    .querySelector('#cityssm-theme--logout-button')
    ?.addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault();
    bulmaJS.confirm({
        contextualColorName: 'warning',
        title: 'Log Out?',
        message: 'Are you sure you want to log out?',
        okButton: {
            text: 'Log Out',
            callbackFunction: () => {
                const urlPrefix = document.querySelector('main')?.dataset.urlPrefix ?? '';
                globalThis.localStorage.clear();
                globalThis.location.href = `${urlPrefix}/logout`;
            }
        }
    });
});
(() => {
    const localStoragePropertyName = 'collapseSidemenu';
    const collapseButtonElement = document.querySelector('#cityssm-theme--sidemenu-collapse-button');
    const collapseSidemenuElement = document.querySelector('#cityssm-theme--sidemenu-collapsed');
    const expandButtonElement = document.querySelector('#cityssm-theme--sidemenu-expand-button');
    const expandSidemenuElement = document.querySelector('#cityssm-theme--sidemenu-expanded');
    const collapseFunction = (clickEvent) => {
        expandSidemenuElement?.classList.add('is-hidden');
        collapseSidemenuElement?.classList.remove('is-hidden');
        try {
            globalThis.localStorage.setItem(localStoragePropertyName, 'true');
        }
        catch {
        }
        if (clickEvent) {
            expandButtonElement?.focus();
        }
    };
    const expandFunction = () => {
        collapseSidemenuElement?.classList.add('is-hidden');
        expandSidemenuElement?.classList.remove('is-hidden');
        try {
            globalThis.localStorage.removeItem(localStoragePropertyName);
        }
        catch {
        }
        collapseButtonElement?.focus();
    };
    if (collapseButtonElement !== null &&
        collapseSidemenuElement !== null &&
        expandButtonElement !== null &&
        expandSidemenuElement !== null) {
        collapseButtonElement.addEventListener('click', collapseFunction);
        expandButtonElement.addEventListener('click', expandFunction);
        try {
            if (globalThis.localStorage.getItem(localStoragePropertyName)) {
                collapseFunction();
            }
        }
        catch {
        }
    }
})();
(() => {
    const keepAliveMillis = document.querySelector('main')?.dataset.sessionKeepAliveMillis;
    if (keepAliveMillis !== undefined && keepAliveMillis !== '0') {
        const urlPrefix = document.querySelector('main')?.dataset.urlPrefix ?? '';
        const keepAliveFunction = () => {
            cityssm.postJSON(`${urlPrefix}/keepAlive`, {
                t: Date.now()
            }, () => {
            });
        };
        globalThis.setInterval(keepAliveFunction, Number.parseInt(keepAliveMillis, 10));
    }
})();
