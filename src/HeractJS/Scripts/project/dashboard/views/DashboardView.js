define([
    'comindware/core',
    './PieChartView',
    './FunnelChartView',
    './template/Dashboard.html'
], function (core, PieChartView, FunnelChartView, template) {
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
            this.chartRegion.show(new PieChartView({}));
        }
    })
});