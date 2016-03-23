define(['coreui'], function (core) {
    'use strict';

    var oldAjax = Backbone.ajax;

    Backbone.ajax = function () {
        var args = arguments;
        var ajaxPromise = new Promise(function (resolve, reject, onCancel) {
            var $xhr = oldAjax.apply(this, args);
            Promise.resolve($xhr).then(function(result) {
                resolve(result);
            }).catch(function(result) {
                reject(result);
            });
            onCancel && onCancel(function() {
                $xhr.abort();
            });
        });
        return core.services.PromiseServer.registerPromise(ajaxPromise);
    };
});