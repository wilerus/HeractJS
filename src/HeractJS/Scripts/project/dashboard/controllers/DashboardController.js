define([
    '../views/DashboardView',
    '../views/DashboardNavigationView',
    '../views/PieChartView',
    '../views/FunnelChartView',
    '../models/PieChartModel',
    '../models/FunnelChartModel'
],
    function (DashboardView, DashboardNavigationView, PieChartView, FunnelChartView, PieChartModel, FunnelChartModel) {
        'use strict';
        return Backbone.Marionette.Controller.extend({
            initialize: function () {
                this.dashboardView = new DashboardView();
                this.navigationView = new DashboardNavigationView();
                this.pieChartModel = new PieChartModel();
                this.funnelChartModel = new FunnelChartModel();
                this.initializeEventsHandling();
            },

            initializeEventsHandling: function () {
                this.listenTo(this.dashboardView, 'show', this.showDashboard);
                this.listenTo(this.navigationView, 'chartChanged', this.changeChart);
            },

            showDashboard: function () {
                this.dashboardView.navigationRegion.show(this.navigationView);
                this.dashboardView.chartRegion.show(new PieChartView(this.pieChartModel));
            },
           
            changeChart: function (e) {
                var id = e.model.attributes.id;
                switch (id) {
                    case 'chart1': this.dashboardView.chartRegion.show(new PieChartView(this.pieChartModel));
                        break
                    case 'chart2': this.dashboardView.chartRegion.show(new FunnelChartView(this.funnelChartModel));
                        break
                }
            }
        });
    });