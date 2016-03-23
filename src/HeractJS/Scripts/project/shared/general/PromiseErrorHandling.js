define(['../services/ErrorService'], function(ErrorService) {
    'use strict';

    window.addEventListener("unhandledrejection", function (e) {
        ErrorService.showGeneralError();
        if (window.flag_debug) {
            return;
        }
        e.preventDefault();
    });
});