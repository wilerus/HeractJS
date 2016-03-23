define([
    'coreui',
    '../templates/notificationsListEmpty.hbs'
], function (core, template) {
    'use strict';

        return Marionette.ItemView.extend({
            template: template,
            className: 'empty-view'
        });
    }
);