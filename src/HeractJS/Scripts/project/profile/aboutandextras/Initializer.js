/**
 * Developer: Peter Volynsky
 * Date: 24.10.13
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */
define([
    'shared',
    './view/Module'
], function (shared, ModuleView) {
    'use strict';

    return Core.Controller.extend({
        helpTopicId: 'PROFILE.ABOUT',

        onDestroy: function() {
            this.view.destroy();
        },

        showProfileAboutAndExtras: function () {
            var layout = this.moduleRegion.el;
            var model = new Backbone.Model({ build: window.fullversion });
            this.view = new ModuleView ({ model: model });
            this.view.render();
            $(layout).html('');
            $(layout).append(this.view.$el);

            //var scrollerPlugin = new sharedNs.view.ContentScroller({ $contentArea: this.view.$el.find('.one-column-wrp') });
        }
    });
});