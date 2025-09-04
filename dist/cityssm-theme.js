"use strict";

(() => {
    const logoutButtonEle = document.querySelector('#cityssm-theme--logout-button');
    if (logoutButtonEle) {
        logoutButtonEle.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                contextualColorName: 'warning',
                title: 'Log Out?',
                message: 'Are you sure you want to log out?',
                okButton: {
                    text: 'Log Out',
                    callbackFunction: () => {
                        const urlPrefix = document.querySelector('main').getAttribute('data-url-prefix') ||
                            '';
                        window.localStorage.clear();
                        window.location.href = urlPrefix + '/logout';
                    }
                }
            });
        });
    }
})();
(() => {
    const localStoragePropertyName = 'collapseSidemenu';
    const collapseButtonEle = document.querySelector('#cityssm-theme--sidemenu-collapse-button');
    const collapseSidemenuEle = document.querySelector('#cityssm-theme--sidemenu-collapsed');
    const expandButtonEle = document.querySelector('#cityssm-theme--sidemenu-expand-button');
    const expandSidemenuEle = document.querySelector('#cityssm-theme--sidemenu-expanded');
    const collapseFunction = (clickEvent) => {
        expandSidemenuEle.classList.add('is-hidden');
        collapseSidemenuEle.classList.remove('is-hidden');
        try {
            window.localStorage.setItem(localStoragePropertyName, 'true');
        }
        catch (_error) {
        }
        if (clickEvent) {
            expandButtonEle.focus();
        }
    };
    const expandFunction = () => {
        collapseSidemenuEle.classList.add('is-hidden');
        expandSidemenuEle.classList.remove('is-hidden');
        try {
            window.localStorage.removeItem(localStoragePropertyName);
        }
        catch (_error) {
        }
        collapseButtonEle.focus();
    };
    if (collapseButtonEle &&
        collapseSidemenuEle &&
        expandButtonEle &&
        expandSidemenuEle) {
        collapseButtonEle.addEventListener('click', collapseFunction);
        expandButtonEle.addEventListener('click', expandFunction);
        try {
            if (window.localStorage.getItem(localStoragePropertyName)) {
                collapseFunction();
            }
        }
        catch (_error) {
        }
    }
})();
(() => {
    const keepAliveMillis = document
        .querySelector('main')
        .getAttribute('data-session-keep-alive-millis');
    if (keepAliveMillis && keepAliveMillis !== '0') {
        const urlPrefix = document.querySelector('main').getAttribute('data-url-prefix') || '';
        const keepAliveFunction = () => {
            cityssm.postJSON(urlPrefix + '/keepAlive', {
                t: Date.now()
            }, () => { });
        };
        window.setInterval(keepAliveFunction, Number.parseInt(keepAliveMillis, 10));
    }
})();
