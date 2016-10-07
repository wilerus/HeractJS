define([
    'comindware/core',
    './PieChartView',
    './FunnelChartView',
    './DashboardNavigationView',
    './template/Dashboard.html'
], function (core, PieChartView, FunnelChartView, DashboardNavigationView, template) {
    'use strict';
    return Marionette.LayoutView.extend({
        initialize: function () {
        },

        template: Handlebars.compile(template),

        regions: {
            navigationRegion: ".dashboard-navigation-region",
            chartRegion: ".chart-test-region"
        },
        className: "dashboard-test",
    })
});