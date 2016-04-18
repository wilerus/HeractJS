/**
 * Developer: Daniil Korolev
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
    'form/App',
    './views/DefaultContentView',
    './widget/WidgetComposite',
    './controllers/UserObjectController'
], function (
    shared, App, DefaultContentView, WidgetComposite, UserObjectController
) {
    'use strict';

    return shared.application.Module.extend({
        contentView: DefaultContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            this.userObjectController = new UserObjectController();
            this.moduleRegion.show(this.userObjectController.formController.formLayoutView);
            App.StateManager.updateForm();
        },

        onDestroy: function () {
            App.destroy();
            this.userObjectController.formController.formLayoutView.destroy();
        },
    });
});
