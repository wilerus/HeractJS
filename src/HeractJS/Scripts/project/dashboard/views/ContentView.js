define([
    './template/contentView.html',
    'shared'
], function (template, shared) {
    'use strict';
    return Marionette.LayoutView.extend({
        template: Handlebars.compile(template),

        className: 'content-view',

        behaviors: {
            ContentViewBehavior: {
                behaviorClass: shared.application.views.behaviors.ContentViewBehavior,
                profileRegion: 'profileRegion',
                moduleLoadingRegion: 'moduleLoadingRegion'
            }
        },

        ui: {
            navigationButton: '.js-navigation-button'
        },

        regions: {
            profileRegion: '.js-profile-region',
            moduleLoadingRegion: '.js-module-loading-region',
            moduleRegion: '.js-module-region',
        },

        setNavigationVisibility: function (visible) {
            if (visible) {
                this.ui.navigationButton.show();
            } else {
                this.ui.navigationButton.hide();
            }
        }
    });
});
