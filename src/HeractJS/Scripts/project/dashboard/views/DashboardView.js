define([
    'comindware/core',
    './PieChartView',
    './FunnelChartView',
    './DashboardNavigationView',
    './template/Dashboard.html'
], function (core, PieChartView, FunnelChartView,DashboardNavigationView, template) {
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

        onShow: function () {
            this.navigationRegion.show(new DashboardNavigationView({}));            this.chartRegion.show(new PieChartView({}));            this.listenTo(this.navigationRegion.currentView, 'chartChanged', this.changeChart);
        },

        changeChart: function (e) {
            var id = e.model.attributes.id;
            console.log(id);       }
    })
});