define(['../services/ErrorService'], function (ErrorService) {
    'use strict';

    var originalModelSync = Backbone.Model.prototype.sync;

	function GetErrorText(code) {
	    switch (code) {
	        case 401: return Localizer.get('PROJECT.COMMON.ERRORS.ACCESSDENIEDEXCEPTION');
	        case 403: return Localizer.get('PROJECT.COMMON.ERRORS.FORBIDDENEXCEPTION');
	        case 404: return Localizer.get('PROJECT.COMMON.ERRORS.NOTFOUND');
	        case 407: return Localizer.get('PROJECT.COMMON.ERRORS.ACCESSDENIEDEXCEPTION');
	        case 409: return Localizer.get('PROJECT.COMMON.ERRORS.CONFLICTEXCEPTION');
	    };

	    return null;
	}

	function handleGeneralError(model, xhr, options) {

	    var msg = GetErrorText(model.status)
        //Show special message when we have it
	    if (msg) {
	        ErrorService.showError(msg);
        }
        //Unknown exception - show general message
        else {
	        ErrorService.showGeneralError();
        }
    }

    Backbone.Model.prototype.sync = function (method, model, options) {
        var oldError = options.error;
        if (oldError) {
            options.error = function(model) {
            	oldError.apply(this, arguments);
            	if (_.str.startsWith(model.status.toString(), '5') || GetErrorText(model.status)) {
		            handleGeneralError.apply(this, arguments);
	            }
            };
        } else {
            options.error = handleGeneralError;
        }
        return originalModelSync.apply(this, arguments);
    };
});
