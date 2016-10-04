define([
    'comindware/core',
    './ChartView',
    './template/Dashboard.html'
], function (core, ChartView, template) {
    'use strict';

    return Marionette.LayoutView.extend({
        initialize: function () {
        },

        template: Handlebars.compile(template),

        regions: {
            chartRegion: ".chart-test-region"
        },
        className: "dashboard-test",
        onShow: function () {
            this.chartRegion.show(new ChartView({
                model: new Backbone.Model({
                    items: [
                      { assignee: 'Scott', text: 'Write a book about Marionette' },
                      { assignee: 'Andrew', text: 'Do some coding' }
                    ]
                })
            }));
        }
    })
});