define([
    'comindware/core',
    './template/Chart.html'
], function (core, template) {
    'use strict';
    return Marionette.ItemView.extend({
        initialize: function () {
        },
        template: Handlebars.compile(template),
    })
})
            