define([], function() {
    'use strict';

    Backbone.oldSync = Backbone.sync;
    //TODO: remove this obsolete code
    Backbone.delayedSync = function (method, model, options) {
        if (model['delayedSync' + '-' + method]) {
            clearTimeout(model['delayedSync' + '-' + method]);
            delete model['delayedSync' + '-' + method];
        }
        model['delayedSync' + '-' + method] = setTimeout(function () {
            Backbone.delayedSyncFlush(method, model, options);
        }, options.syncTimeout || 100);
    };

    Backbone.delayedSyncFlush = function (method, model, options) {
        if (model._trackingChanges) {
            if (method === 'patch' && model.unsavedAttributes()) options.attrs = _.extend(model.unsavedAttributes(), options.attrs);
        }
        if (model) {
            clearTimeout(model['delayedSync' + '-' + method]);
            delete model['delayedSync' + '-' + method];
            Backbone.oldSync.apply(self, [method, model, options]);
            if (!options.syncDelay) {
                if (model._trackingChanges) {
                    model._resetTracking();
                    model._triggerUnsavedChanges();
                }
            }
        }
    };

    Backbone.chooseSync = function (method, model, options) {
        if (options.syncDelay) {
            return Backbone.delayedSync;
        } else if (model['delayedSync' + '-' + method]) {
            clearTimeout(model['delayedSync' + '-' + method]);
            delete model['delayedSync' + '-' + method];
            return Backbone.delayedSyncFlush;
        } else {
            return Backbone.oldSync;
        }
    };

    Backbone.sync = function (method, model, options) {
        return Backbone.chooseSync(method, model, options).apply(this, [method, model, options]);
    };

    Backbone.sync = _.wrap(Backbone.sync, function (oldSync, method, model, options) {
    	options = options || {};

    	if (model._trackingChanges) {
    		if (method === 'patch') {
    			if (model.unsavedAttributes()) {
    			    options.attrs = _.extend(model.unsavedAttributes(), options.attrs, options.extraData);
    			} else {
    				return Promise.resolve();
    			}
    		}
    	}
    	return oldSync(method, model, options);
    });

});