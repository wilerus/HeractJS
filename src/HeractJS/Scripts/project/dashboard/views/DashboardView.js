define([
    'comindware/core',
    './ChartView',
    './DashboardNavigationView',
    './template/Dashboard.html'
], function (core, ChartView,DashboardNavigationView, template) {
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
            this.navigationRegion.show(new DashboardNavigationView({
            }));
            this.chartRegion.show(new ChartView({
            }));
            this.listenTo(this.navigationRegion.currentView, 'chartChanged', this.changeChart);
        },

        changeChart: function (e) {
            var id = e.model.attributes.id;
            console.log(id);       }
    })
});