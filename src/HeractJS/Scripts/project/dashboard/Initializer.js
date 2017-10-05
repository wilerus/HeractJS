define([
    'shared',
    './controllers/DashboardController',
    './views/ContentView',
    './views/DashboardView'
], function (
    shared, DashboardController, ContentView, DashboardView
) {
    'use strict';

    return shared.application.Module.extend({
        
        contentView: ContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            this.Controller = new DashboardController({});
            this.moduleRegion.show(this.Controller.dashboardView);
        }
    });
});