define([
    'shared',
    './views/ContentView',
    './views/DashboardView'
], function (
    shared, ContentView, DashboardView
) {
    'use strict';

    return shared.application.Module.extend({
        contentView: ContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            this.moduleRegion.show(new DashboardView({}));
        }
    });
});