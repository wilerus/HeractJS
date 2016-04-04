/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define([
    'shared',
    './views/ContentView',
    './views/GridView',
    'ganttChart'
], function(
    shared, ContentView, GridView, ganttChart
) {
    'use strict';

    return shared.application.Module.extend({
        contentView: ContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            new ganttChart.Initializer();
            this.moduleRegion.show(new GridView({}));
        }
    });
});
