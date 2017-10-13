/**
 * Developer: Oleg Verevkin
 * Date: 08.11.2016
 * Copyright: 2009-2017 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

import shared from 'shared';
import template from '../templates/contentView.html';

export default Marionette.LayoutView.extend({
    template: Handlebars.compile(template),

    className: 'content-view',

    behaviors: {
        ContentViewBehavior: {
            behaviorClass: shared.application.views.behaviors.ContentViewBehavior,
            profileRegion: 'profileRegion',
            moduleLoadingRegion: 'moduleLoadingRegion'
        }
    },

    ui: {
        navigationButton: '.js-navigation-button',
        bigButton: '.js-big-button'
    },

    events: {
        'click @ui.bigButton': '__handleBigButton'
    },

    regions: {
        profileRegion: '.js-profile-region',
        moduleLoadingRegion: '.js-module-loading-region',
        ganttNavigation: '.js-module-gantt-toolbar',
        ganttTaskLine: '.js-module-gantt-taskline',
        moduleRegion: '.js-module-region-left',
        ganttRegion: '.js-module-region-right'
    },

    setNavigationVisibility: function (visible) {
        if (visible) {
            this.ui.navigationButton.show();
        } else {
            this.ui.navigationButton.hide();
        }
    },

    __handleBigButton() {
        this.trigger('websoket:message', 'foo');
    }
});
